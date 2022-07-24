import { Produk } from "../produk";

it("implements optimistic concurrency control", async () => {
  // Create an instance of a product
  const produk = Produk.build({
    nama: "Sample Dress",
    harga: 1990,
    userId: "6214a0227e0d2db80ddb0860",
    gambarItem: {
      gambar1: "./asset/sample.jpg",
    },
    warna: "White,Black",
    kategori: "Dress",
    deskripsi:
      "Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.",
    jumlahStock: 1,
    diPesan: false,
  });

  // Save the product to the database
  await produk.save();

  // fetch the product twice
  const firstInstance = await Produk.findById(produk.id);
  const secondInstance = await Produk.findById(produk.id);

  // make two separate changes to the products we fetched
  firstInstance!.set({ harga: 1900 });
  secondInstance!.set({ harga: 1890 });

  // save the first fetched product
  await firstInstance!.save();

  // save the second fetched product and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("Should not reach this point");
});

it("increments the version number on multiple saves", async () => {
  const produk = Produk.build({
    nama: "Sample Dress",
    harga: 1990,
    userId: "6214a0227e0d2db80ddb0860",
    gambarItem: {
      gambar1: "./asset/sample.jpg",
    },
    warna: "White,Black",
    kategori: "Dress",
    deskripsi:
      "Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.",
    jumlahStock: 1,
    diPesan: false,
  });

  await produk.save();
  expect(produk.version).toEqual(0);
  await produk.save();
  expect(produk.version).toEqual(1);
  await produk.save();
  expect(produk.version).toEqual(2);
});
