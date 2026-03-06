import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../Button/Button';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  args: {
    open: false,
    onClose: () => {},
    title: '',
    children: null,
  },
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    primaryButtonText: { control: 'text' },
    secondaryButtonText: { control: 'text' },
    danger: { control: 'boolean' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    title: 'Modal Title',
    subtitle: 'Optional subtitle',
    primaryButtonText: 'Confirm',
    secondaryButtonText: 'Cancel',
    children: <p>Modal body content goes here. You can place any content.</p>,
  },
};

export const DangerConfirmation: Story = {
  args: {
    open: true,
    title: 'Delete Product',
    subtitle: 'This action cannot be undone',
    primaryButtonText: 'Delete',
    secondaryButtonText: 'Cancel',
    danger: true,
    children: (
      <p>
        Are you sure you want to delete <strong>&quot;Minimalist Backpack&quot;</strong>?
        This will remove it from your store permanently.
      </p>
    ),
  },
};

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Add Product"
          primaryButtonText="Add"
          secondaryButtonText="Cancel"
          onPrimaryAction={() => {
            alert('Product added!');
            setOpen(false);
          }}
        >
          <p>Fill in the product details to add it to your store.</p>
        </Modal>
      </>
    );
  },
};

export const Small: Story = {
  args: {
    open: true,
    title: 'Small Modal',
    size: 'sm',
    primaryButtonText: 'OK',
    children: <p>A compact modal for simple confirmations.</p>,
  },
};

export const Large: Story = {
  args: {
    open: true,
    title: 'Large Modal',
    size: 'lg',
    primaryButtonText: 'Save',
    secondaryButtonText: 'Discard',
    children: (
      <div style={{ minHeight: 200 }}>
        <p>A larger modal with plenty of room for complex forms or content.</p>
      </div>
    ),
  },
};
