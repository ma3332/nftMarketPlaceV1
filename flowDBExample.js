const imageNFTGeneral = new Uint32Array();
const image1155General = new Uint32Array();

// DB NFT & 1155 General example
// This is for NFT & 1155 Categories
const schema_nft_general = {
  _id: "0x4321", // primary ID is nft address
  type: "NFT",
  name: "Collection NFT 1",
  image: imageNFTGeneral,
  creatorAddress: "0x2a3a900590e1AE9BCd6549Fd9F73A8fed50A207c",
  creatorName: "Uniqlo",
  category: "Clothes",
};

const schema_1155_general = {
  _id: "0x1234",
  type: "ERC1155",
  name: "Collection ERC1155 1",
  image: image1155General,
  creator: "0x2a3a900590e1AE9BCd6549Fd9F73A8fed50A207c",
  creatorName: "Uniqlo",
  category: "Clothes",
};

// users && creator DB
const schema_marketPlace_user = {
  _id: "0xb98Ef0896C9f1A175B97078f40097ea9fdf18588", // primary ID is user address
  name: "Tuan Anh",
  address: "35/21/Hanoi",
  avatar: {},
  tel: "0911111111",
  PaymentGateway: [{}],
  card_validation: true,
  noTxFree: 1000,
  list_of_nft_noListed: [
    {
      collection: "0x4321", // primary ID is nft address, match to "schema_nft_general" for details of nft
      tokenOwner: [
        {
          tokenID: 1, // match to "schema_NFT_details" for details of tokenID in nft
          amt: 1,
        },
        {
          tokenID: 2, // match to "schema_NFT_details" for details of tokenID in nft
          amt: 1,
        },
      ],
    },
    {
      collection: "0x9876", // primary ID is nft address, match to "schema_nft_general" for details of nft
      tokenOwner: [
        {
          tokenID: 1, // match to "schema_NFT_details" for details of tokenID in nft
          amt: 1,
        },
        {
          tokenID: 2, // match to "schema_NFT_details" for details of tokenID in nft
          amt: 1,
        },
      ],
    },
  ],
  list_of_nft_Listed: [
    {
      collection: "0x4321", // primary ID is nft address, match to "schema_nft_general" for details of nft
      tokenOwner: [
        {
          tokenID: 5, // match to "schema_NFT_details" for details of tokenID in nft
          amt: 1,
        },
        {
          tokenID: 6, // match to "schema_NFT_details" for details of tokenID in nft
          amt: 1,
        },
      ],
    },
    {
      collection: "0x9876", // primary ID is nft address, match to "schema_nft_general" for details of nft
      tokenOwner: [
        {
          tokenID: 7, // match to "schema_NFT_details" for details of tokenID in nft
          amt: 1,
        },
        {
          tokenID: 8, // match to "schema_NFT_details" for details of tokenID in nft
          amt: 1,
        },
      ],
    },
  ],
  list_of_1155_noListed: [
    {
      collection: "0x1234", // primary ID is 1155 address, match to "schema_1155_general" for details of 1155
      tokenOwner: [
        {
          tokenID: 1, // match to "schema_1155_details" for details of tokenID in 1155
          amt: 10,
        },
        {
          tokenID: 2, // match to "schema_1155_details" for details of tokenID in 1155
          amt: 20,
        },
      ],
    },
    {
      collection: "0x6879", // primary ID is 1155 address, match to "schema_1155_general" for details of 1155
      tokenOwner: [
        {
          tokenID: 3, // match to "schema_1155_details" for details of tokenID in 1155
          amt: 10,
        },
        {
          tokenID: 4, // match to "schema_1155_details" for details of tokenID in 1155
          amt: 20,
        },
      ],
    },
  ],
  list_of_1155_Listed: [
    {
      collection: "0x1234", // primary ID is 1155 address, match to "schema_1155_general" for details of 1155
      tokenOwner: [
        {
          tokenID: 5, // match to "schema_1155_details" for details of tokenID in 1155
          amt: 10,
        },
        {
          tokenID: 6, // match to "schema_1155_details" for details of tokenID in 1155
          amt: 20,
        },
      ],
    },
    {
      collection: "0x6879", // primary ID is 1155 address, match to "schema_1155_general" for details of 1155
      tokenOwner: [
        {
          tokenID: 7, // match to "schema_1155_details" for details of tokenID in 1155
          amt: 10,
        },
        {
          tokenID: 8, // match to "schema_1155_details" for details of tokenID in 1155
          amt: 20,
        },
      ],
    },
  ],
};

// NFT Collection Details DB
const schema_NFT_details = {
  _id: "0x4321", // primary ID is nft address
  type: "NFT",
  name: "Collection NFT 1",
  image: imageNFTGeneral,
  creator: "0x2a3a900590e1AE9BCd6549Fd9F73A8fed50A207c",
  creatorName: "Uniqlo",
  category: "Clothes",
  tokenInfo: [
    {
      tokenID: 1,
      addressFrom: "0x0",
      addressTo: "0xb98Ef0896C9f1A175B97078f40097ea9fdf18588",
      tokenURI: "https://ipfs.io",
      tokenImageLink: "https://ipfs.io",
      tokenName: "Silly Bear",
      tokenAttribute: "Silly",
      tokenMetadata: "",
      tokenMetadataHash: "0x...",
      tokenImage: {},
      tokenImageHash: "0x...",
      dateCreated: "",
    },
    {
      tokenID: 2,
      addressFrom: "0x0",
      addressTo: "0xb98Ef0896C9f1A175B97078f40097ea9fdf18588",
      tokenURI: "https://ipfs.io",
      tokenImageLink: "https://ipfs.io",
      tokenName: "Smart Bear",
      tokenAttribute: "Smart",
      tokenMetadata: "",
      tokenMetadataHash: "0x...",
      tokenImage: {},
      tokenImageHash: "0x...",
      dateCreated: "",
    },
  ],
};

// ERC1155 Collection Details DB
const schema_1155_details = {
  _id: "0x1234", // primary ID is 1155 address
  type: "ERC1155",
  name: "Collection ERC1155 1",
  image: image1155General,
  creator: "0x2a3a900590e1AE9BCd6549Fd9F73A8fed50A207c",
  creatorName: "Uniqlo",
  category: "Clothes",
  tokenInfo: [
    {
      tokenID: 5,
      addressFrom: "0x0",
      addressTo: "0xb98Ef0896C9f1A175B97078f40097ea9fdf18588",
      tokenURI: "https://ipfs.io",
      tokenImageLink: "https://ipfs.io",
      tokenName: "Silly Bear",
      tokenAttribute: "Silly",
      tokenAmt: 10000,
      tokenMetadata: "",
      tokenMetadataHash: "0x...",
      tokenImage: {},
      tokenImageHash: "0x...",
      dateCreated: "",
    },
    {
      tokenID: 6,
      addressFrom: "0x0",
      addressTo: "0xb98Ef0896C9f1A175B97078f40097ea9fdf18588",
      tokenURI: "https://ipfs.io",
      tokenImageLink: "https://ipfs.io",
      tokenName: "Smart Bear",
      tokenAttribute: "Smart",
      tokenAmt: 10000,
      tokenMetadata: "",
      tokenMetadataHash: "0x...",
      tokenImage: {},
      tokenImageHash: "0x...",
      dateCreated: "",
    },
  ],
};

// NFT Collection Details Listed in Market
const schema_nft_market = {
  _id: "0x4321", // primary ID is nft address, match to "schema_nft_general" for details of nft
  tokenID: 1, // match to "schema_NFT_details" for details of tokenID in nft
  marketID: 123,
  addressSeller: "0x..",
  addressBuyer: "0x..",
  unitPrice: 100000,
  currency: "VND",
  priceHistory: [
    {
      value: 80000,
      time: "",
      buyer: "0x...",
    },
  ],
  listedTime: "",
  view: 200,
  cancel: false,
};

// 1155 Collection Details Listed in Market
const schema_1155_market = {
  _id: "0x1234", // primary ID is 1155 address, match to "schema_1155_general" for details of 1155
  tokenID: 5, // match to "schema_1155_details" for details of tokenID in 1155
  marketID: 512,
  addressSeller: "0x..",
  addressBuyer: "0x..",
  unitPrice: 100000,
  currency: "VND",
  amtToken: 100,
  listedTime: "",
  view: 200,
  cancel: false,
};
