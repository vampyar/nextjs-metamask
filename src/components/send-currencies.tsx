import { Controller, useForm } from 'react-hook-form';
import { sendCurrenciesResolver, TSendCurrencies } from '@/validations/send-currencies';
import { useMetaMask } from '@/hooks/useMetamask';
import { formatEther } from 'ethers';
import Dropdown, { IDropdownItem } from '@/components/ui/dropdown';

export const SendCurrencies = () => {
  const { account } = useMetaMask();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSendCurrencies>({
    resolver: sendCurrenciesResolver,
  });

  const currencies: IDropdownItem<string>[] = [
    {
      label: 'USDC',
      value: 'USDC',
    },
  ];
  const onSubmit = async (data: TSendCurrencies) => {
    const params = [{ from: account, to: data.receiver, value: formatEther(data.amount) }];
    // const result = await ethereum.request({
    //   method: 'eth_chainId',
    //   params,
    // });

    console.log(params, '<<< result');
  };

  return (
    <form className="px-8 pt-6 pb-8 mb-4 w-auto md:w-96 " onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-center font-bold mb-">Send currency</h1>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700 capitalize" htmlFor="receiver">
          receiver
        </label>
        <input
          className="input focus:shadow-outline"
          autoComplete="off"
          id="from"
          type="text"
          placeholder="receiver"
          {...register('receiver')}
        />
        {errors.receiver?.message && (
          <p className="text-red-500 text-xs italic">{errors.receiver?.message}</p>
        )}
      </div>
      <div className="relative mb-4">
        <Controller
          control={control}
          name="currency"
          render={({ field: { onChange } }) => (
            <Dropdown
              label="Currency"
              options={currencies}
              onClick={(prop) => onChange(prop.value)}
            />
          )}
        />
        {errors.currency?.message && (
          <p className="text-red-500 text-xs italic">{errors.currency?.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700 capitalize" htmlFor="to">
          amount
        </label>
        <input
          className="input focus:shadow-outline"
          autoComplete="off"
          id="to"
          type="text"
          placeholder="amount"
          {...register('amount')}
        />
        {errors.amount?.message && (
          <p className="text-red-500 text-xs italic">{errors.amount?.message}</p>
        )}
      </div>
      <div className="mb-6 text-center">
        <button className="btn bg-gray-900 focus:shadow-outline" type="submit">
          Send
        </button>
      </div>
    </form>
  );
};
