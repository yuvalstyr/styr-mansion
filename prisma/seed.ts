import {
  PrismaClient,
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
const db = new PrismaClient()

//  function that return random odd number between 1 to 12
function getRandomOddNumber(): string {
  const randomNumber = Math.floor(Math.random() * 12) + 1
  if (randomNumber % 2 === 0) {
    return getRandomOddNumber()
  }
  return String(randomNumber)
}

// function that return a year between current year to current year + 3
function getRandomYear() {
  const currentYear = new Date().getFullYear()
  const randomYear = Math.floor(Math.random() * 1) + currentYear
  return String(randomYear)
}

function getActionEnum(action: string) {
  const enumFields = Object.keys(TransactionAction)

  if (enumFields.includes(action)) {
    const ActionAsEnum = action as TransactionAction
    return TransactionAction[ActionAsEnum]
  }

  return TransactionAction.CONSTRUCTION
}

function getOwnerEnum(owner: string) {
  const enumFields = Object.keys(TransactionOwner)

  if (enumFields.includes(owner)) {
    const OwnerAsEnum = owner as TransactionOwner
    return TransactionOwner[OwnerAsEnum]
  }

  return TransactionOwner.Yuval
}

function getTypeEnum(owner: string) {
  const enumFields = Object.keys(TransactionType)

  if (enumFields.includes(owner)) {
    const OwnerAsEnum = owner as TransactionType
    return TransactionType[OwnerAsEnum]
  }

  return TransactionType.DEPOSIT
}

async function seed() {
  await Promise.all(
    getTransactions().map((t) => {
      return db.transaction.create({
        data: {
          action: getActionEnum(t.action),
          amount: t.amount,
          description: t.description,
          type: getTypeEnum(t.type),
          owner: getOwnerEnum(t.owner),
          year: getRandomYear(),
          month: getRandomOddNumber(),
        },
      })
    })
  )
}

seed()

function getTransactions() {
  return [
    {
      amount: 4,
      description: "win today",
      type: "DEPOSIT",
      action: "CONSTRUCTION",
      owner: "Yuval",
    },
    {
      amount: 18,
      description: "today",
      type: "DEPOSIT",
      action: "RENT",
      owner: "Ran",
    },
    {
      amount: 503,
      description: "מזגן",
      type: "WITHDRAWAL",
      action: "FIX",
      owner: "Yuval",
    },
    {
      amount: 205,
      description: "rent",
      type: "DEPOSIT",
      action: "RENT",
      owner: "Ran",
    },
    {
      amount: 22,
      description: "dadas",
      type: "DEPOSIT",
      action: "RENT",
      owner: "Ran",
    },
  ]
}
