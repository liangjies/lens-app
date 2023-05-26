import { Readable } from 'stream';

import { WebBundlr } from '@bundlr-network/client';
import { ImageType } from '@lens-protocol/react-web';
import { providers, utils } from 'ethers';
import { ReadableWebToNodeStream } from 'readable-web-to-node-stream';
import { fetchSigner } from 'wagmi/actions';

import { ILocalFile } from './hooks/useFileSelect';
import { never } from './utils';
import axios from 'axios';

const TOP_UP = '200000000000000000'; // 0.2 MATIC
const MIN_FUNDS = 0.05;

async function getBundlr() {
  const signer = (await fetchSigner()) ?? never('Cannot get signer');
  const provider = signer?.provider ?? never('Cannot get provider');

  if (provider instanceof providers.JsonRpcProvider) {
    await provider.send('wallet_switchEthereumChain', [{ chainId: utils.hexValue(80001) }]);
  }

  const bundlr = new WebBundlr('https://devnet.bundlr.network', 'matic', signer?.provider, {
    providerUrl: 'https://rpc-mumbai.maticvigil.com/',
  });

  await bundlr.ready();

  const balance = await bundlr.getBalance((await signer?.getAddress()) ?? never());

  // if (bundlr.utils.unitConverter(balance).toNumber() < MIN_FUNDS) {
  //   await bundlr.fund(TOP_UP);
  // }

  return bundlr;
}

export async function upload(data: unknown): Promise<string> {

  try {
    const upload = await axios('https://metadata.lenster.xyz/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    });

    const { id }: { id: string } = upload?.data;

    return `https://arweave.net/`+id;
  } catch {
    throw new Error("error");
  }

  // const bundlr = await getBundlr();

  // const serialized = JSON.stringify(data);
  // const tx = await bundlr.upload(serialized, {
  //   tags: [{ name: 'Content-Type', value: 'application/json' }],
  // });

  // return `https://arweave.net/${tx.id}`;
  return `https://arweave.net/bInnirCp_9TucgGgZ7zqgbPmpf7ZHyLs08-UE7wUmwc`
}

export async function uploadImage(file: ILocalFile<ImageType>): Promise<string> {
  const bundlr = await getBundlr();

  const webStream = file.stream();
  const nodeStream = new ReadableWebToNodeStream(webStream);

  const tx = await bundlr.upload(nodeStream as unknown as Readable, {
    tags: [{ name: 'Content-Type', value: file.type }],
  });

  return `https://arweave.net/${tx.id}`;
}
