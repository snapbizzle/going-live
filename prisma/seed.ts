import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      name: "BioMed",
      description: "Biomedical equipment technician responsible for medical device support",
      category: "Technical",
      defaultNotes: "Responsible for all biomedical equipment on site",
    },
    {
      name: "ZOLL Rep",
      description: "ZOLL Medical representative for defibrillator and resuscitation equipment",
      category: "Vendor",
      defaultNotes: "Provides support for ZOLL defibrillators and AEDs",
    },
    {
      name: "Pharmacy",
      description: "Pharmacist or pharmacy technician for medication management",
      category: "Clinical",
      defaultNotes: "Manages medication distribution and tracking",
    },
    {
      name: "Hospital Educator",
      description: "Clinical educator responsible for staff training and education",
      category: "Education",
      defaultNotes: "Coordinates training sessions and competency assessments",
    },
    {
      name: "Supply/Materials",
      description: "Supply chain and materials management coordinator",
      category: "Operations",
      defaultNotes: "Manages supply inventory and distribution",
    },
  ];

  for (const role of roles) {
    await prisma.role.create({ data: role });
  }
  console.log("Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
