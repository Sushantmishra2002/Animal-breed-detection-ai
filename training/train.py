import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset, WeightedRandomSampler
from torchvision import transforms, models
from torchvision.models import ResNet50_Weights
from pathlib import Path
from PIL import Image
import pickle
from collections import Counter

# ================= PROJECT SETUP =================
PROJECT_ROOT = Path(__file__).parent.parent
os.chdir(PROJECT_ROOT)

# ================= CONFIG =================
CONFIG = {
    'dataset_path':      str(PROJECT_ROOT / 'dataset'),
    'model_save_path':   str(PROJECT_ROOT / 'model' / 'breed_classifier.pth'),
    'class_mapping_path':str(PROJECT_ROOT / 'model' / 'class_mapping.pkl'),
    'batch_size':        16,
    'num_epochs':        25,
    'lr_head':           1e-3,    # LR for new FC head (phase 1)
    'lr_finetune':       1e-5,    # LR for backbone fine-tune (phase 2)
    'image_size':        224,
    'num_workers':       0,
    'device':            'cuda' if torch.cuda.is_available() else 'cpu'
}
print(f"Using device: {CONFIG['device']}")

# ================= DATASET =================
class BreedDataset(Dataset):
    def __init__(self, root_dir, transform=None):
        self.root_dir  = Path(root_dir)
        self.transform = transform
        self.images    = []
        self.labels    = []

        # MUST be sorted — same order as val set & class_mapping
        self.classes      = sorted([d.name for d in self.root_dir.iterdir() if d.is_dir()])
        self.class_to_idx = {cls: idx for idx, cls in enumerate(self.classes)}

        for class_name in self.classes:
            class_dir = self.root_dir / class_name
            for img_file in class_dir.glob('*'):
                if img_file.suffix.lower() in ['.jpg', '.jpeg', '.png', '.bmp']:
                    self.images.append(str(img_file))
                    self.labels.append(self.class_to_idx[class_name])

        print(f"Loaded {len(self.images)} images across {len(self.classes)} classes")
        counts = Counter(self.labels)
        for idx, cls in enumerate(self.classes):
            print(f"  {cls:35s}: {counts[idx]:5d} images")

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        try:
            image = Image.open(self.images[idx]).convert('RGB')
            if self.transform:
                image = self.transform(image)
            return image, self.labels[idx]
        except Exception as e:
            print(f"[ERROR] Cannot load {self.images[idx]}: {e}")
            return torch.zeros(3, CONFIG['image_size'], CONFIG['image_size']), self.labels[idx]


# ================= DATALOADER =================
def create_dataloaders(dataset_path, batch_size):

    # Training: augmentation + normalization
    train_transform = transforms.Compose([
        transforms.RandomResizedCrop(224, scale=(0.7, 1.0)),
        transforms.RandomHorizontalFlip(),
        transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.2),
        transforms.RandomRotation(15),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],   # ← REQUIRED
                             std= [0.229, 0.224, 0.225])
    ])

    # Validation: NO augmentation — only resize, crop, normalize
    val_transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],   # ← SAME values
                             std= [0.229, 0.224, 0.225])
    ])

    train_dataset = BreedDataset(os.path.join(dataset_path, 'train'), train_transform)
    val_dataset   = BreedDataset(os.path.join(dataset_path, 'val'),   val_transform)

    # --- Weighted sampler: minority breeds sampled more often ---
    targets       = train_dataset.labels
    class_counts  = Counter(targets)
    total         = len(targets)
    sample_weights = [total / class_counts[t] for t in targets]
    sampler = WeightedRandomSampler(
        weights=sample_weights,
        num_samples=len(sample_weights),
        replacement=True
    )

    train_loader = DataLoader(train_dataset, batch_size=batch_size,
                              sampler=sampler, num_workers=CONFIG['num_workers'])
    val_loader   = DataLoader(val_dataset,   batch_size=batch_size,
                              shuffle=False,  num_workers=CONFIG['num_workers'])

    return train_loader, val_loader, train_dataset


# ================= MODEL =================
def create_model(num_classes):
    print(f"\nInitializing ResNet-50 for {num_classes} classes...")
    model = models.resnet50(weights=ResNet50_Weights.DEFAULT)

    # Phase 1: freeze entire backbone
    for param in model.parameters():
        param.requires_grad = False

    # Replace FC with a deeper head
    model.fc = nn.Sequential(
        nn.Dropout(0.4),
        nn.Linear(2048, 512),
        nn.ReLU(),
        nn.Dropout(0.3),
        nn.Linear(512, num_classes)
    )
    return model


# ================= TRAIN ONE EPOCH =================
def train_epoch(model, loader, criterion, optimizer, device):
    model.train()
    total_loss, correct, total = 0.0, 0, 0

    for i, (images, labels) in enumerate(loader):
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss    = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()
        _, predicted = outputs.max(1)
        correct += predicted.eq(labels).sum().item()
        total   += labels.size(0)

        if (i + 1) % 20 == 0:
            print(f"  Batch {i+1}/{len(loader)} | loss={loss.item():.4f}")

    return total_loss / len(loader), 100. * correct / total


# ================= VALIDATE =================
def validate(model, loader, criterion, device, num_classes, idx_to_class):
    model.eval()
    total_loss, correct, total = 0.0, 0, 0
    class_correct = [0] * num_classes
    class_total   = [0] * num_classes

    with torch.no_grad():
        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss    = criterion(outputs, labels)
            total_loss += loss.item()
            _, predicted = outputs.max(1)
            correct += predicted.eq(labels).sum().item()
            total   += labels.size(0)
            for j in range(len(labels)):
                class_correct[labels[j]] += (predicted[j] == labels[j]).item()
                class_total[labels[j]]   += 1

    # Per-class accuracy
    print("  Per-class accuracy:")
    for i in range(num_classes):
        if class_total[i] > 0:
            acc = 100. * class_correct[i] / class_total[i]
            bar = "█" * int(acc // 5)
            print(f"    {idx_to_class[i]:35s}: {acc:5.1f}%  {bar}")

    return total_loss / len(loader), 100. * correct / total


# ================= MAIN TRAIN =================
def train_model(model, train_loader, val_loader, num_classes, idx_to_class):
    device = CONFIG['device']

    # Class weights for loss function (extra penalty for misclassifying rare breeds)
    targets      = train_loader.dataset.labels
    class_counts = Counter(targets)
    total        = len(targets)
    class_weights = torch.tensor(
        [total / (num_classes * class_counts[i]) for i in range(num_classes)],
        dtype=torch.float32
    ).to(device)

    criterion = nn.CrossEntropyLoss(weight=class_weights)

    # Phase 1 optimizer: only FC head
    optimizer = optim.Adam(model.fc.parameters(), lr=CONFIG['lr_head'])
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=CONFIG['num_epochs'])

    best_val_acc = 0.0
    FINETUNE_EPOCH = 8   # unfreeze layer4 at this epoch

    for epoch in range(CONFIG['num_epochs']):
        print(f"\n{'='*55}")
        print(f"Epoch {epoch+1}/{CONFIG['num_epochs']}")
        print(f"{'='*55}")

        # Phase 2: unfreeze layer4 at epoch FINETUNE_EPOCH
        if epoch == FINETUNE_EPOCH:
            print(">> Unfreezing layer4 for fine-tuning...")
            for name, param in model.named_parameters():
                if 'layer4' in name or 'fc' in name:
                    param.requires_grad = True
            # Lower LR for pretrained layers to avoid destroying features
            optimizer = optim.Adam([
                {'params': model.layer4.parameters(), 'lr': CONFIG['lr_finetune']},
                {'params': model.fc.parameters(),     'lr': CONFIG['lr_head'] * 0.1},
            ])
            scheduler = optim.lr_scheduler.CosineAnnealingLR(
                optimizer, T_max=CONFIG['num_epochs'] - FINETUNE_EPOCH
            )

        train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer, device)
        print(f"\nTrain — Loss: {train_loss:.4f} | Acc: {train_acc:.1f}%")

        val_loss, val_acc = validate(model, val_loader, criterion, device, num_classes, idx_to_class)
        print(f"Val   — Loss: {val_loss:.4f}   | Acc: {val_acc:.1f}%")

        scheduler.step()

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), CONFIG['model_save_path'])
            print(f"  ✓ Best model saved (val_acc={val_acc:.1f}%)")

    print(f"\nDone. Best val accuracy: {best_val_acc:.1f}%")
    return model


# ================= MAIN =================
def main():
    print("\n===== STARTING TRAINING =====")
    os.makedirs(os.path.dirname(CONFIG['model_save_path']), exist_ok=True)

    train_loader, val_loader, train_dataset = create_dataloaders(
        CONFIG['dataset_path'], CONFIG['batch_size']
    )

    num_classes  = len(train_dataset.classes)
    idx_to_class = {idx: cls for idx, cls in enumerate(train_dataset.classes)}

    print(f"\nTotal classes: {num_classes}")
    print(f"Class order:   {train_dataset.classes}")

    # Save mapping BEFORE training so inference always matches
    with open(CONFIG['class_mapping_path'], 'wb') as f:
        pickle.dump(idx_to_class, f)   # {0: 'BreedA', 1: 'BreedB', ...}
    print(f"Class mapping saved: {idx_to_class}")

    model = create_model(num_classes).to(CONFIG['device'])
    train_model(model, train_loader, val_loader, num_classes, idx_to_class)

    print("\n✅ TRAINING COMPLETE")


if __name__ == "__main__":
    main()