// frontend/src/contracts/MemeIndexStaking.ts

import { Address, Contract, ContractProvider, Sender } from '@ton/core';

export class MemeIndexStaking implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Buffer; data: Buffer }
    ) {}

    static createFromAddress(address: Address) {
        return new MemeIndexStaking(address);
    }

    async getStake(provider: ContractProvider, address: Address): Promise<bigint> {
        const result = await provider.get('getStake', [
            { type: 'address', value: address }
        ]);
        return result.stack.readBigNumber();
    }

    async getTotalStaked(provider: ContractProvider): Promise<bigint> {
        const result = await provider.get('getTotalStaked', []);
        return result.stack.readBigNumber();
    }

    async getCurrentSupply(provider: ContractProvider): Promise<bigint> {
        const result = await provider.get('getCurrentSupply', []);
        return result.stack.readBigNumber();
    }

    async sendStake(provider: ContractProvider, via: Sender, amount: bigint) {
        await provider.internal(via, {
            value: amount,
            body: 'stake'
        });
    }

    async sendWithdraw(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: '0.1',
            body: 'withdraw'
        });
    }
}