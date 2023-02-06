# Poly-vote
## E-voting using Smart Contract Blockchain Polygon

- E-voting using Smart Contract Blockchain Polygon ini dibuat dengan React memiliki fitur:

1. Connect Wallet Network Polygon Mumbai
2. Voting Candidate
3. Formulir registrasi
4. Melihat hasil voting secara real time

Tiap aktivitas transasksi membutuhkan fees berupa MATIC

## Penggunaan
1. Lakukan cloning repositori **Poly-Vote** , pastikan abi json smart contract valid
2. Jalankan _npm i_.
3. Jalankan _npm start_.
4. Buka broswer ketikan url > _localhost:3000_.
5. Pastikan broswer sudah terinstall metamask dan rpc network polygon mumbai

## Dockerizing :
1. Jalankan _docker build . -t genesis_.
2. Jalankan _docker images_ untuk mengecek image sudah ter build / belum
3. Jalankan imgae _docker run -p 3000:3000 -d genesis_
4. Buka broswer ketika url > _localhost:3000_

## Credits

Author: Yanuarso (Twitter: ekoyanu99)