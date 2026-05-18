export type Company = {
  id: string
  companyName: string
  accountNumber: string
  streetAddress: string
  city: string
  state: string
  zip: string
  email: string
}

export type SearchScope =
  | "all"
  | "companyName"
  | "accountNumber"
  | "streetAddress"
  | "city"
  | "state"
  | "zip"
  | "email"

export const SEARCH_SCOPES: { value: SearchScope; label: string }[] = [
  { value: "all", label: "All columns" },
  { value: "companyName", label: "Company name" },
  { value: "accountNumber", label: "Account number" },
  { value: "streetAddress", label: "Street address" },
  { value: "city", label: "City" },
  { value: "state", label: "State" },
  { value: "zip", label: "Zip" },
  { value: "email", label: "Email" },
]
