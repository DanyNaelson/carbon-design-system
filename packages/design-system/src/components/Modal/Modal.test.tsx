import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    title: 'Test Modal',
  };

  it('renders when open', () => {
    render(
      <Modal {...defaultProps}>
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('displays title', () => {
    render(
      <Modal {...defaultProps}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('renders primary and secondary buttons', () => {
    render(
      <Modal
        {...defaultProps}
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
      >
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onPrimaryAction when primary button is clicked', async () => {
    const user = userEvent.setup();
    const onPrimaryAction = vi.fn();

    render(
      <Modal {...defaultProps} primaryButtonText="Save" onPrimaryAction={onPrimaryAction}>
        <p>Content</p>
      </Modal>
    );

    await user.click(screen.getByText('Save'));
    expect(onPrimaryAction).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when secondary button is clicked (no onSecondaryAction)', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal {...defaultProps} onClose={onClose} secondaryButtonText="Cancel">
        <p>Content</p>
      </Modal>
    );

    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('does not render footer when no button texts provided', () => {
    const { container } = render(
      <Modal {...defaultProps}>
        <p>Content only</p>
      </Modal>
    );
    // No footer buttons rendered
    const buttons = container.querySelectorAll('button');
    // Only the close (X) button from Carbon modal header
    const actionButtons = Array.from(buttons).filter(
      (b) => b.textContent === 'Save' || b.textContent === 'Cancel'
    );
    expect(actionButtons).toHaveLength(0);
  });
});
