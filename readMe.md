# Task 1: Xây dựng luồng cho Nút Create NFT & 1155

1. Front End - tham khảo Figma
2. Luồng - tham khảo https://app.diagrams.net/#G15WtVL8gwtodIODdIlUdb1JdqZ8zlKWlj - ô Create NFT/ 1155

Một số setup cần thiết

1. Server + Mongo DB
2. Để test cho nhanh thì cài Ganache UI: https://trufflesuite.com/ganache/
3. Set Up IPFS - tham khảo folder IPFS example
4. Lấy API từ Infura hoặc Alchemy để tương tác với Blockchain testnet. Target test với mạng lưới Goerli của ETH
5. Cài thêm Metamask để dễ kiểm soát và dùng nó làm web3 provider trong khi dev front-end, kết nối Metamask với Ganache UI

Các bước làm

0. Thay đổi các trường thông tin của file env (theo như PubKey và PrivKey của Ganache hoặc của Account tự tạo trên testnet)
1. Chạy lần lượt các file python (từ 1 đến 5). Hoàn toàn có thể dùng thư viện Hardhat (JS) để deploy các smart contract này nếu muốn
   - 1_deployProxyAdmin.py: ProxyAdmin là SmartContract quản lý Proxy
   - 2_deployMarketPlace.py: MarketPlace là SmartContract quản lý Market, nơi người dùng sẽ đăng các NFT hoặc 1155 của họ lên đây
   - 3_deployProxy.py: Người dùng sẽ không tương tác trực tiếp với MarketPlace ở bước 2 mà sẽ tương tác thông qua Proxy. Proxy này sẽ giúp trong trường hợp MarketPlace thay đổi (thêm function, thay đổi parameters ...) thì người dùng sẽ không bị ảnh hưởng
   - 4_deployNFT.py: NFT là smartContract mà người dùng sử dụng để tạo NFT (sau khi tạo xong NFT thì mới có thể đăng lên MarketPlace thông qua Proxy)
   - 5_deployERC1155.py: ERC1155 là smartContract mà người dùng sử dụng để tạo 1155 (sau khi tạo xong 1155 thì mới có thể đăng lên MarketPlace thông qua Proxy)
   - 6_deployMarketPlaceV2.py: MarketPlaceV2 giả định sau khi đã nâng cấp - thêm 1 function testforfun(). Người dùng vẫn sẽ tương tác với MarketPlaceV2 thông qua proxy như bình thường.
2. Tạo một vài NFT Smart Contract bằng cách chạy file 4_deployNFT.py vài lần. Sau đó Lưu trên \*DB các trường thông tin với Schema như sau
   - Tên của Smart Contract
   - Loại Smart Contract (NFT hay 1155)
   - Địa chỉ Address của Smart Contract
   - HÌnh ảnh Đại diện cho các Smart Contract đó (Avatar)
   - // Các bước này hoàn toàn làm từ phía admin nên ko cần UI-UX, có thể làm thủ công ở backend //
3. Xây dựng Web3 với provider là Metamask kết nối với Ganache UI. Ở trang "Create NFT/1155 Page" (tham khảo figma)
   - Query từ DB (ở bước 2)
   - Mỗi một SmartContract là Category
4. User chọn 1 Category bất kì của trang "Create NFT/1155 Page" với filter NFT sẽ ra trang "Create NFT Single Create Page"
5. Input của trang "Create NFT Single Create Page"

   - 5.1 Điền đầy đủ các thông tin Upload Image, NFT Name, NFT Information
   - 5.2 Hash Image & Hash NFT Name + Metadata ở phía client
   - 5.3 Kiểm tra xem thông tin ở trên có trùng trên \*DB không
   - 5.4 Nếu không trùng thì Upload lên IPFS
   - 5.5 IPFS sẽ trả về một đường link "https://ipfs.io/ipfs/CID?filename" trong đó CID là content identifier. Đây chính là input vào function "mintNftToken(string memory tokenURI)" của NFT Smart Contract
   - 5.6 Thực hiện lệnh "mintNftToken" và thông báo khách hàng đã upload lên IPFS và tạo NFT thành công
   - 5.7 Kiểm tra lại thông tin đã tạo
   - 5.8 Lắng nghe sự kiện "event Transfer( address indexed from, address indexed to, uint256 indexed tokenId )" của NFT SmartContract đó và lấy các trường thông tin

     - address indexed from
     - address indexed to
     - uint256 indexed tokenId

   - 5.9 Chính thức lưu vào \*\*DB các thông tin sau (lưu ý \*\*DB này có thể khác với \*DB tạo ở bước 2). Mỗi một NFT Contract sẽ có 1 collection DB riêng (tham khảo https://app.diagrams.net/#G15WtVL8gwtodIODdIlUdb1JdqZ8zlKWlj, các hình màu đỏ tượng trưng cho DB). Schema sẽ như sau:

     - NFT Smart Contract Address
     - NFT Smart Contract Name
     - Image (input của User từ bước ở trên)
     - Image Hash
     - NFT Name (input của User từ bước ở trên)
     - NFT Information (input của User từ bước ở trên)
     - NFT Name + Information Hash
     - Token URI (trả về từ IPFS)
     - address indexed from (trả về từ listen event của Smart Contract)
     - address indexed to (trả về từ listen event của Smart Contract)
     - uint256 indexed tokenId (trả về từ listen event của Smart Contract) \*\* primary key

6. Query từ \*\*DB để lấy thông tin cho các ô bên phải của trang Create NFT Single Create Page
7. Trường hợp user muốn tạo NFT Batch thì chạy hàm mintNftBatchToken() tương ứng với NFT Smart Contract đó, flow sau đó sẽ tương tự như ở bước 5 (tham khảo https://app.diagrams.net/#G15WtVL8gwtodIODdIlUdb1JdqZ8zlKWlj - ô Create NFT/ 1155 - Choose NFT Category)
8. Trường hợp user muốn xóa NFT thì chạy hàm burnNftToken() tương ứng với NFT Smart Contract đó. Sau khi thực hiện xong sẽ xóa toàn bộ thông tin tương ứng với tokenId trên \*\*DB. (tham khảo https://app.diagrams.net/#G15WtVL8gwtodIODdIlUdb1JdqZ8zlKWlj - ô Create NFT/ 1155 - Choose NFT Category)

Làm tương tự từ bước 2 đến bước 8 trở đi với các smart contract ERC1155.

- Lưu ý hàm và sự kiện của ERC1155 khác so với NFT nên cần tham khảo lại flow trong https://app.diagrams.net/#G15WtVL8gwtodIODdIlUdb1JdqZ8zlKWlj - ô Create NFT/ 1155 - Choose 1155 Category
- DB của 1155 khác với DB của NFT

# Task 2: Xây dựng luồng cho NFT MarketPlace
