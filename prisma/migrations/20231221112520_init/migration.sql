-- CreateTable
CREATE TABLE "Nutrient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Nutrient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grp" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Grp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Food" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "grp_id" INTEGER NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nutdata" (
    "id" SERIAL NOT NULL,
    "food_id" INTEGER NOT NULL,
    "nutrient_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Nutdata_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_grp_id_fkey" FOREIGN KEY ("grp_id") REFERENCES "Grp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutdata" ADD CONSTRAINT "Nutdata_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutdata" ADD CONSTRAINT "Nutdata_nutrient_id_fkey" FOREIGN KEY ("nutrient_id") REFERENCES "Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
