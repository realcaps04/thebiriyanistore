import { useMutation, useQuery } from 'convex/react'
import { Check, Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

export type DeliveryAddress = {
  _id: Id<'deliveryAddresses'>
  label: string
  contactName: string
  phone: string
  addressLine: string
  pincode?: string
  isDefault: boolean
}

export const ADDRESS_TITLE_PRESETS = ['Home', 'Work', 'Office', 'Other'] as const

const SELECTED_ADDRESS_KEY = 'tbs_selected_delivery_address'

type AddressForm = {
  label: string
  contactName: string
  phone: string
  addressLine: string
  pincode: string
}

function normalizeLabelKey(label: string) {
  return label.trim().toLowerCase()
}

export function suggestUniqueTitle(addresses: DeliveryAddress[]) {
  const taken = new Set(addresses.map((address) => normalizeLabelKey(address.label)))

  for (const preset of ADDRESS_TITLE_PRESETS) {
    if (!taken.has(preset.toLowerCase())) return preset
  }

  let index = addresses.length + 1
  while (taken.has(`address ${index}`.toLowerCase())) {
    index += 1
  }

  return `Address ${index}`
}

export function isTitleTaken(label: string, addresses: DeliveryAddress[], excludeId?: string) {
  const key = normalizeLabelKey(label)
  if (!key) return false

  return addresses.some(
    (address) => address._id !== excludeId && normalizeLabelKey(address.label) === key,
  )
}

const emptyForm = (contactName = '', addresses: DeliveryAddress[] = []): AddressForm => ({
  label: suggestUniqueTitle(addresses),
  contactName,
  phone: '',
  addressLine: '',
  pincode: '',
})

export function useDeliveryAddresses(token: string | null, defaultContactName: string) {
  const addressesQuery = useQuery(
    api.addresses.listAddresses,
    token ? { token } : 'skip',
  )
  const addresses = addressesQuery ?? []
  const addAddress = useMutation(api.addresses.addAddress)
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    localStorage.getItem(SELECTED_ADDRESS_KEY),
  )

  useEffect(() => {
    if (addresses.length === 0) {
      setSelectedId(null)
      localStorage.removeItem(SELECTED_ADDRESS_KEY)
      return
    }

    const stillValid = selectedId && addresses.some((address) => address._id === selectedId)
    if (stillValid) return

    const fallback =
      addresses.find((address) => address.isDefault)?._id ?? addresses[0]?._id ?? null
    setSelectedId(fallback)
    if (fallback) localStorage.setItem(SELECTED_ADDRESS_KEY, fallback)
  }, [addresses, selectedId])

  const selectedAddress =
    addresses.find((address) => address._id === selectedId) ?? null

  const selectAddress = (id: string) => {
    setSelectedId(id)
    localStorage.setItem(SELECTED_ADDRESS_KEY, id)
  }

  const saveAddress = async (form: AddressForm) => {
    if (!token) return null

    if (isTitleTaken(form.label, addresses)) {
      throw new Error(
        `An address titled "${form.label.trim()}" already exists. Choose a different title.`,
      )
    }

    const result = await addAddress({
      token,
      address: {
        label: form.label,
        contactName: form.contactName,
        phone: form.phone,
        addressLine: form.addressLine,
        pincode: form.pincode || undefined,
      },
    })

    selectAddress(result.addressId)
    return result.addressId
  }

  return {
    addresses,
    selectedAddress,
    selectedId,
    selectAddress,
    saveAddress,
    isLoading: Boolean(token) && addressesQuery === undefined,
    emptyForm: () => emptyForm(defaultContactName, addresses),
  }
}

type DeliveryAddressSheetProps = {
  open: boolean
  mode: 'pick' | 'add'
  addresses: DeliveryAddress[]
  selectedId: string | null
  form: AddressForm
  saving: boolean
  labelError?: string | null
  onClose: () => void
  onSwitchToAdd: () => void
  onSelect: (id: string) => void
  onFormChange: (form: AddressForm) => void
  onSave: () => void
}

export function DeliveryAddressSheet({
  open,
  mode,
  addresses,
  selectedId,
  form,
  saving,
  labelError,
  onClose,
  onSwitchToAdd,
  onSelect,
  onFormChange,
  onSave,
}: DeliveryAddressSheetProps) {
  if (!open) return null

  const titleTaken = isTitleTaken(form.label, addresses)
  const canSave = isAddressFormValid(form) && !titleTaken

  return (
    <div className="address-sheet-backdrop" role="presentation" onClick={onClose}>
      <div
        className="address-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-sheet-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="address-sheet__head">
          <h2 id="address-sheet-title" className="address-sheet__title">
            {mode === 'add' ? 'Add delivery address' : 'Choose delivery address'}
          </h2>
          <button type="button" className="address-sheet__close" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {mode === 'pick' ? (
          <div className="address-sheet__body">
            {addresses.length === 0 ? (
              <p className="address-sheet__empty">No saved addresses yet. Add one to continue.</p>
            ) : (
              <ul className="address-sheet__list">
                {addresses.map((address) => {
                  const active = address._id === selectedId
                  return (
                    <li key={address._id}>
                      <button
                        type="button"
                        className={`address-card ${active ? 'address-card--active' : ''}`}
                        onClick={() => onSelect(address._id)}
                      >
                        <div className="address-card__head">
                          <span className="address-card__label">{address.label}</span>
                          {active && (
                            <span className="address-card__check" aria-hidden>
                              <Check size={14} strokeWidth={2.75} />
                            </span>
                          )}
                        </div>
                        <span className="address-card__name">{address.contactName}</span>
                        <span className="address-card__phone">{address.phone}</span>
                        <span className="address-card__line">{address.addressLine}</span>
                        {address.pincode && (
                          <span className="address-card__pincode">{address.pincode}</span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            <button type="button" className="address-sheet__add-btn" onClick={onSwitchToAdd}>
              <Plus size={16} aria-hidden />
              Add new address
            </button>

            {addresses.length > 0 && (
              <button type="button" className="address-sheet__confirm-btn" onClick={onClose}>
                Use this address
              </button>
            )}
          </div>
        ) : (
          <div className="address-sheet__body">
            <div className="address-field">
              <span>Address title</span>
              <div className="address-title-chips">
                {ADDRESS_TITLE_PRESETS.map((preset) => {
                  const taken = isTitleTaken(preset, addresses)
                  const active = normalizeLabelKey(form.label) === preset.toLowerCase()
                  return (
                    <button
                      key={preset}
                      type="button"
                      disabled={taken}
                      className={`address-title-chip ${active ? 'address-title-chip--active' : ''}`}
                      onClick={() => onFormChange({ ...form, label: preset })}
                    >
                      {preset}
                      {taken ? ' (used)' : ''}
                    </button>
                  )
                })}
              </div>
              <input
                type="text"
                value={form.label}
                placeholder="e.g. Home, Work, Parents"
                onChange={(event) => onFormChange({ ...form, label: event.target.value })}
              />
              {(labelError || titleTaken) && (
                <p className="address-field__error">
                  {labelError ??
                    `Title "${form.label.trim()}" is already used. Pick a unique title.`}
                </p>
              )}
            </div>
            <label className="address-field">
              <span>Contact name</span>
              <input
                type="text"
                value={form.contactName}
                placeholder="Full name"
                onChange={(event) => onFormChange({ ...form, contactName: event.target.value })}
              />
            </label>
            <label className="address-field">
              <span>Contact number</span>
              <input
                type="tel"
                inputMode="tel"
                value={form.phone}
                placeholder="10-digit mobile number"
                onChange={(event) => onFormChange({ ...form, phone: event.target.value })}
              />
            </label>
            <label className="address-field">
              <span>Delivery address</span>
              <textarea
                rows={3}
                value={form.addressLine}
                placeholder="House no., street, area, landmark"
                onChange={(event) => onFormChange({ ...form, addressLine: event.target.value })}
              />
            </label>
            <label className="address-field">
              <span>Pincode (optional)</span>
              <input
                type="text"
                inputMode="numeric"
                value={form.pincode}
                placeholder="682017"
                onChange={(event) => onFormChange({ ...form, pincode: event.target.value })}
              />
            </label>

            <button
              type="button"
              className="address-sheet__confirm-btn"
              disabled={saving || !canSave}
              onClick={onSave}
            >
              {saving ? 'Saving…' : 'Save address'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function isAddressFormValid(form: AddressForm) {
  const phoneDigits = form.phone.replace(/\D/g, '')
  return (
    form.label.trim().length > 0 &&
    form.contactName.trim().length > 0 &&
    phoneDigits.length >= 10 &&
    form.addressLine.trim().length >= 8
  )
}

export function formatAddressLine(address: DeliveryAddress) {
  return address.pincode
    ? `${address.addressLine}, ${address.pincode}`
    : address.addressLine
}
