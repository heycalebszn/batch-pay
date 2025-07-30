
import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { baseAccount } from "wagmi/connectors";

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    baseAccount({
      appName: 'BatchPay',
      version: '1',
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})

// declare module 'wagmi' {
//   interface Register {
//     config: typeof config
//   }
// }

// import { baseAccount } from "wagmi/connectors";