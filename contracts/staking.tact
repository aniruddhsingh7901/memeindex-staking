import "@stdlib/deploy";

message Stake {
    amount: Int;
    timestamp: Int;
}

contract MemeIndexStaking {
    const MIN_STAKE: Int = ton("1");
    const BURN_PERCENT: Int = 50;    
    
    owner: Address;          
    totalStaked: Int;        
    totalSupply: Int;        
    targetSupply: Int;       
    
    stakes: map<Address, Int>;    
    stakeTime: map<Address, Int>; 

    init(owner: Address) {
        self.owner = owner;
        self.totalStaked = 0;
        self.totalSupply = 1000000000; // 1B initial supply
        self.targetSupply = 500000000; // 500M target
        self.stakes = emptyMap();
        self.stakeTime = emptyMap();
    }

    receive("stake") {
        let sender: Address = context().sender;
        let amount: Int = context().value;
        
        require(amount >= self.MIN_STAKE, "Stake too small");
        
        let currentStake: Int = self.stakes.get(sender)!!;
        self.stakes.set(sender, currentStake + amount);
        self.stakeTime.set(sender, now());
        
        self.totalStaked = self.totalStaked + amount;
    }

    receive("withdraw") {
        let sender: Address = context().sender;
        let stakeAmount: Int = self.stakes.get(sender)!!;
        
        require(stakeAmount > 0, "No stake found");
        
        let burnAmount: Int = 0;
        if (self.totalSupply > self.targetSupply) {
            burnAmount = (stakeAmount * self.BURN_PERCENT) / 100;
        }
        
        self.totalStaked = self.totalStaked - stakeAmount;
        self.totalSupply = self.totalSupply - burnAmount;
        self.stakes.set(sender, 0);
        self.stakeTime.set(sender, 0);
        
        send(SendParameters{
            to: sender,
            value: stakeAmount - burnAmount,
            mode: SendIgnoreErrors
        });
    }

    get fun getStake(addr: Address): Int {
        return self.stakes.get(addr)!!;
    }
    
    get fun getTotalStaked(): Int {
        return self.totalStaked;
    }
    
    get fun getCurrentSupply(): Int {
        return self.totalSupply;
    }
}