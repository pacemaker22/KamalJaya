import { Produk } from "../produk";

it("memastikan harga bernilai positif", async () => {
  // membuat produk
  const produk = Produk.build({
    nama: "Pulpen Faster",
    harga: 25000,
    userId: "6214a0227e0d2db80ddb0860",
    gambarItem: {
      gambar1: " ",
    },
    warna: "Merah",
    kategori: "Alat Tulis",
    deskripsi: "Pulpen merk faster",
    jumlahStok: 3,
    diPesan: false,
  });
  

  //menyimpan produk ke database
  await produk.save();
  // fetch the product twice
  const firstInstance = await Produk.findById(produk.id);
  const secondInstance = await Produk.findById(produk.id);

  // membuat 2 perubahan yang terpisah ke produk yang di fetching
  firstInstance!.set({ harga: 1900 });
  secondInstance!.set({ harga: 1890 });

  // menyimpan produk yang pertama kali di fetching
  await firstInstance!.save();

  // menyimpan produk kedua dan error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("Error");
});

it("increment untuk version dari produk", async () => {
  const produk = Produk.build({
    nama: "Pulpen Faster",
    harga: 25000,
    userId: "6214a0227e0d2db80ddb0860",
    gambarItem: {
      gambar1: " ",
    },
    warna: "Merah",
    kategori: "Alat Tulis",
    deskripsi: "Pulpen merk faster",
    jumlahStok: 3,
    diPesan: false,
  });

  await produk.save();
  expect(produk.version).toEqual(0);
  await produk.save();
  expect(produk.version).toEqual(1);
  await produk.save();
  expect(produk.version).toEqual(2);
});
