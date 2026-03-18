'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/ui';
import { Button } from '@/shared/ui';

interface DeleteConfirmProps {
  instanceName: string;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirm({
  instanceName,
  open,
  onConfirm,
  onCancel,
}: DeleteConfirmProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Instance</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="text-foreground font-medium">{instanceName}</span>?
            This will permanently remove all instance files including saves,
            mods, and configs.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
