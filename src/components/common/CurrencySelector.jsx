import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import { CURRENCIES } from '../../utils/currency';

const CurrencySelector = ({ className = '' }) => {
    const { currency, setCurrency, availableCurrencies } = useCurrency();

    return (
        <Menu as="div" className={`relative inline-block text-left ${className}`}>
            <div>
                <Menu.Button className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-ocean-600 transition-colors">
                    <span>{CURRENCIES[currency].symbol}</span>
                    <span>{currency}</span>
                    <ChevronDownIcon className="w-4 h-4" />
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {availableCurrencies.map((code) => (
                            <Menu.Item key={code}>
                                {({ active }) => (
                                    <button
                                        onClick={() => setCurrency(code)}
                                        className={`${active ? 'bg-ocean-50 text-ocean-600' : 'text-gray-700'} ${currency === code ? 'font-semibold' : ''
                                            } group flex w-full items-center px-4 py-2 text-sm`}
                                    >
                                        <span className="mr-2">{CURRENCIES[code].symbol}</span>
                                        <span>{code}</span>
                                        {currency === code && <span className="ml-auto text-ocean-600">✓</span>}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

CurrencySelector.propTypes = {
    className: PropTypes.string,
};

export default CurrencySelector;
