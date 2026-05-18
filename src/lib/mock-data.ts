import { faker } from "@faker-js/faker"
import type { Company } from "@/components/data-table/types"

export function generateMockCompanies(count: number): Company[] {
  faker.seed(42)
  return Array.from({ length: count }, () => {
    const companyName = faker.company.name()
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const emailDomain = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 20)
    return {
      id: faker.string.uuid(),
      companyName,
      accountNumber: faker.string.numeric({ length: 8 }),
      streetAddress: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zip: faker.location.zipCode("#####"),
      email: faker.internet
        .email({ firstName, lastName, provider: `${emailDomain || "example"}.com` })
        .toLowerCase(),
    }
  })
}
