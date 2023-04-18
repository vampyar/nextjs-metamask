import { Menu, Transition } from '@headlessui/react';
import { Fragment, useCallback, useMemo } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export interface IDropdownItem<T> {
  label: string;
  value: T;
}
export interface IDropdownProps<T> {
  label: string;
  value: T;
  options: IDropdownItem<T>[];
  onClick: (p: IDropdownItem<T>) => void;
}
export default function Dropdown<T>({ label, options, onClick, value }: IDropdownProps<T>) {
  const handleOnClick = useCallback(
    (props: IDropdownItem<T>) => {
      onClick(props);
    },
    [options],
  );
  const optionsMemo = useMemo(() => {
    return options?.map((props, index) => (
      <Menu.Item key={index}>
        {({ active }) => (
          <span
            onClick={() => handleOnClick(props)}
            className={`${
              active ? 'bg-gray-900 text-white' : 'text-gray-900'
            } group flex w-full items-center rounded-md px-2 py-2 text-sm w-full`}
          >
            {props.label}
          </span>
        )}
      </Menu.Item>
    ));
  }, [options, onClick]);

  return (
    <div className="top-16 w-full text-right">
      <Menu as="div" className="relative w-full">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            {(value && `${value}`) || label}
            <ChevronDownIcon
              className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">{optionsMemo}</div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
