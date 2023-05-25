import axios from 'axios';

export const saveToIPFS = async () => {
  try {
    // const file = new Blob([JSON.stringify(data)], {
    //   type: 'application/json',
    // });
    // const ipfs = create({url: 'https://ipfs.infura.io:5001/api/v0'});
    // const ipfs = create();
    // const {cid} = await ipfs.add(data);
    // const cidString = cid.toString();
    // console.info('https://cloudflare-ipfs.com/ipfs/' + cidString);
    // return cidString;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getIPFSMessage = async cid => {
  try {
    const r = await axios.get('https://cloudflare-ipfs.com/ipfs/' + cid);
    return r;
  } catch (error) {
    console.log(error);
    return null;
  }
};
