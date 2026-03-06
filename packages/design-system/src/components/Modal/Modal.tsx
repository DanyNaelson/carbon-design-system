import React from 'react';
import { ComposedModal, ModalHeader, ModalBody, ModalFooter } from '@carbon/react';
import { Button } from '../Button';

export interface ModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Called when the modal should close */
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Modal body content */
  children: React.ReactNode;
  /** Text for the primary action button */
  primaryButtonText?: string;
  /** Text for the secondary action button */
  secondaryButtonText?: string;
  /** Called when primary button is clicked */
  onPrimaryAction?: () => void;
  /** Called when secondary button is clicked */
  onSecondaryAction?: () => void;
  /** Whether the primary action is in a loading/danger state */
  danger?: boolean;
  /** Size of the modal */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Prevent closing by clicking outside */
  preventCloseOnClickOutside?: boolean;
  className?: string;
}

/**
 * Modal component — wraps Carbon ComposedModal for flexible dialog patterns.
 *
 * @example
 * ```tsx
 * import { Modal } from '@yourorg/design-system';
 *
 * <Modal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Delete"
 *   primaryButtonText="Delete"
 *   secondaryButtonText="Cancel"
 *   danger
 *   onPrimaryAction={handleDelete}
 * >
 *   <p>Are you sure you want to delete this product?</p>
 * </Modal>
 * ```
 */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryAction,
  onSecondaryAction,
  danger = false,
  size = 'md',
  preventCloseOnClickOutside = false,
  className,
}: ModalProps) {
  return (
    <ComposedModal
      open={open}
      onClose={onClose}
      size={size}
      preventCloseOnClickOutside={preventCloseOnClickOutside}
      className={className}
    >
      <ModalHeader title={title} label={subtitle} />
      <ModalBody>{children}</ModalBody>
      {(primaryButtonText || secondaryButtonText) && (
        <ModalFooter>
          {secondaryButtonText && (
            <Button variant="secondary" onClick={onSecondaryAction ?? onClose}>
              {secondaryButtonText}
            </Button>
          )}
          {primaryButtonText && (
            <Button
              variant={danger ? 'danger' : 'primary'}
              onClick={onPrimaryAction}
            >
              {primaryButtonText}
            </Button>
          )}
        </ModalFooter>
      )}
    </ComposedModal>
  );
}
