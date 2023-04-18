import { useMetaMask } from '@/hooks/useMetamask';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Web3 from 'web3';
import { IAbiItem, useAbis } from '@/hooks/useAbi';
import { Spinner } from '@/components/ui/spinner';
import erc20 from '@/constants/erc20.abi.json';

interface ITokenItem extends IAbiItem {
  balance: string;
}

const getTokenBalance = async (abis: IAbiItem[], account: string | null) => {
  return Promise.all(
    abis.map(async (item) => {
      const web3 = new Web3(
        `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
      );
      const contractInstance = new web3.eth.Contract(item.abi || erc20, item.address);

      const tokenBalance = await contractInstance.methods.balanceOf(account).call();
      const balance = web3.utils.fromWei(tokenBalance, 'ether');
      return {
        ...item,
        balance,
      };
    }),
  );
};

const AssetsPage = () => {
  // Note: Temporary solution for but for it case it using JWT strategy
  const { account } = useMetaMask();
  const { push } = useRouter();
  useEffect(() => {
    if (!account) {
      push('/');
    }
  }, [account, push]);

  const [tokens, setTokens] = useState<ITokenItem[]>([]);

  const { abis, isLoading } = useAbis();

  useEffect(() => {
    getTokenBalance(abis, account).then((result) => {
      console.log(result, '<<< result');
      setTokens(result);
    });
  }, [abis]);

  const tokensMemo = useMemo(
    () =>
      tokens.map((item, index) => (
        <tr className="border-b border-gray-200 border-gray-700" key={index}>
          <th
            scope="row"
            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-900 text-white bg-gray-800 flex items-center	"
          >
            <img className="mr-4" src={item.logoURI} alt={item.symbol} width="50" height="50" />
            <span className="mr-1">{item.name}</span>
            <span className="invisible lg:visible">({item.symbol})</span>
          </th>
          <td className="px-6 py-4">{item.balance}</td>
        </tr>
      )),
    [tokens],
  );

  if (isLoading) return <Spinner />;

  return (
    <div className="md:container md:mx-auto">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="table-fixed w-full text-sm text-left text-gray-500 text-gray-400">
          <thead className="text-xs text-gray-700 uppercase text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 bg-gray-900 bg-gray-800 text-white">
                Coin
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>{tokensMemo}</tbody>
        </table>
        {!tokens.length && <span className="flex w-full m-auto justify-center">No records</span>}
      </div>
    </div>
  );
};

export default AssetsPage;
