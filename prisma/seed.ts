import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      name: "BioMed",
      description:
        "Biomedical equipment technician responsible for medical device support",
      category: "Technical",
      defaultNotes: "Ensure all biomedical equipment is operational",
    },
    {
      name: "ZOLL Rep",
      description:
        "ZOLL Medical representative for defibrillator and resuscitation equipment",
      category: "Vendor",
      defaultNotes: "Verify defibrillator readiness and provide ZOLL support",
    },
    {
      name: "Pharmacy",
      description:
        "Pharmacist or pharmacy technician for medication management",
      category: "Clinical",
      defaultNotes: "Prepare and manage medication supplies",
    },
    {
      name: "Hospital Educator",
      description:
        "Clinical educator responsible for staff training and education",
      category: "Education",
      defaultNotes: "Coordinate staff orientation and in-service training",
    },
    {
      name: "Supply/Materials",
      description: "Supply chain and materials management coordinator",
      category: "Operations",
      defaultNotes: "Manage inventory and coordinate supply distribution",
    },
  ];

  for (const role of roles) {
    const existing = await prisma.role.findFirst({
      where: { name: role.name },
    });
    if (!existing) {
      await prisma.role.create({ data: role });
    }
  }

  console.log("✅ Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
