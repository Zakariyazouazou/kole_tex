'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { protectedApi } from '@/api';
import { extractApiError } from '@/lib/extractApiError';
import type { Address, CreateAddressPayload } from '@/types/address.types';

const schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  isDefault: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editAddress?: Address | null;
}

export function AddressFormModal({ open, onClose, onSuccess, editAddress }: Props) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      isDefault: false,
    },
  });

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (editAddress) {
      reset({
        fullName: editAddress.fullName,
        phoneNumber: editAddress.phoneNumber,
        addressLine1: editAddress.addressLine1,
        addressLine2: editAddress.addressLine2 ?? '',
        city: editAddress.city,
        state: editAddress.state ?? '',
        postalCode: editAddress.postalCode,
        country: editAddress.country,
        isDefault: editAddress.isDefault,
      });
    } else {
      reset({
        fullName: '',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        isDefault: false,
      });
    }
  }, [open, editAddress, reset]);

  const isDefault = watch('isDefault');

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const payload: CreateAddressPayload = {
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2 || undefined,
      city: values.city,
      state: values.state || undefined,
      postalCode: values.postalCode,
      country: values.country,
      isDefault: values.isDefault,
    };
    try {
      if (editAddress) {
        await protectedApi.updateAddress(editAddress.id, payload);
      } else {
        await protectedApi.createAddress(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Full name *</Label>
              <Input placeholder="John Doe" {...register('fullName')} />
              {errors.fullName && (
                <p className="text-xs text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label>Phone number *</Label>
              <Input placeholder="+1 555 000 0000" {...register('phoneNumber')} />
              {errors.phoneNumber && (
                <p className="text-xs text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label>Address line 1 *</Label>
              <Input placeholder="123 Main St" {...register('addressLine1')} />
              {errors.addressLine1 && (
                <p className="text-xs text-red-600">{errors.addressLine1.message}</p>
              )}
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label>Address line 2</Label>
              <Input placeholder="Apt 4B (optional)" {...register('addressLine2')} />
            </div>

            <div className="space-y-1.5">
              <Label>City *</Label>
              <Input placeholder="New York" {...register('city')} />
              {errors.city && (
                <p className="text-xs text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>State / Region</Label>
              <Input placeholder="NY (optional)" {...register('state')} />
            </div>

            <div className="space-y-1.5">
              <Label>Postal code *</Label>
              <Input placeholder="10001" {...register('postalCode')} />
              {errors.postalCode && (
                <p className="text-xs text-red-600">{errors.postalCode.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Country *</Label>
              <Input placeholder="United States" {...register('country')} />
              {errors.country && (
                <p className="text-xs text-red-600">{errors.country.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Checkbox
              id="isDefault"
              checked={isDefault}
              onCheckedChange={(checked) => setValue('isDefault', !!checked)}
            />
            <Label htmlFor="isDefault" className="cursor-pointer font-normal">
              Set as default address
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-blue hover:bg-brand-blue-dark text-white"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editAddress ? (
                'Save changes'
              ) : (
                'Add address'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
