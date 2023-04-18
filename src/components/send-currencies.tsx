import { Controller, useForm } from 'react-hook-form';
import { sendCurrenciesResolver, TSendCurrencies } from '@/validations/send-currencies.validation';
import { useMetaMask } from '@/hooks/useMetamask';
import Dropdown, { IDropdownItem } from '@/components/ui/dropdown';
import { useCurrencies } from '@/hooks/useCurrencies';
import { useCallback, useMemo } from 'react';
import { notify } from '@/utils/notify';
import { convertAmountToEther } from '@/utils/web3';

export const SendCurrencies = () => {
  const { account, ethereum, checkTransactionConfirmation } = useMetaMask();
  const { currencies } = useCurrencies();
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSendCurrencies>({
    resolver: sendCurrenciesResolver,
  });

  const currenciesMemo: IDropdownItem<string>[] = useMemo(
    () =>
      currencies.map((item) => ({
        label: item.name,
        value: item.symbol,
      })),
    [currencies],
  );
  const onSubmit = useCallback(
    async (data: TSendCurrencies) => {
      const params = [
        {
          from: account,
          to: data.receiver,
          value: convertAmountToEther(data.amount.toString()),
        },
      ];
      if (data.receiver === account) {
        return notify("Address receiver can't be same with sender");
      }

      try {
        const response = await ethereum.request({
          method: 'eth_sendTransaction',
          params,
        });
        const result = await checkTransactionConfirmation(response);
        if (result === 'confirmed') {
          notify('Transaction success');
        }
        reset();
      } catch (error: any) {
        notify(error?.message);
      }
    },
    [account],
  );

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
        {errors?.receiver && (
          <span className="text-red-500 text-xs italic">{errors?.receiver?.message}</span>
        )}
      </div>
      <div className="relative mb-4">
        <Controller
          control={control}
          name="currency"
          render={({ field: { onChange, value } }) => (
            <Dropdown
              label="Currency"
              options={currenciesMemo}
              value={value}
              onClick={(prop) => onChange(prop.value)}
            />
          )}
        />
        {errors?.currency && (
          <span className="text-red-500 text-xs italic">{errors?.currency?.message}</span>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700 capitalize" htmlFor="to">
          amount
        </label>
        <Controller
          control={control}
          name="amount"
          render={({ field }) => (
            <input
              className="input focus:shadow-outline"
              autoComplete="off"
              id="amount"
              type="text"
              placeholder="amount"
              value={field.value}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        {errors?.amount && (
          <span className="text-red-500 text-xs italic">{errors?.amount?.message}</span>
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
