import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure can create plan as contract owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        "flex-nest",
        "create-plan",
        [types.uint(1), types.ascii("Basic Plan"), types.uint(100), types.uint(30)],
        wallet_1.address
      )
    ]);
    
    assertEquals(block.receipts[0].result.expectOk(), true);
  }
});

Clarinet.test({
  name: "Ensure non-owner cannot create plan", 
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_2 = accounts.get("wallet_2")!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        "flex-nest", 
        "create-plan",
        [types.uint(1), types.ascii("Basic Plan"), types.uint(100), types.uint(30)],
        wallet_2.address
      )
    ]);
    
    assertEquals(block.receipts[0].result.expectErr(), "u100");
  }
});

Clarinet.test({
  name: "Ensure can subscribe to valid plan",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    const wallet_2 = accounts.get("wallet_2")!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        "flex-nest",
        "create-plan", 
        [types.uint(1), types.ascii("Basic Plan"), types.uint(100), types.uint(30)],
        wallet_1.address
      ),
      Tx.contractCall(
        "flex-nest",
        "subscribe",
        [types.uint(1)],  
        wallet_2.address
      )
    ]);
    
    assertEquals(block.receipts[1].result.expectOk(), true);
  }
});

Clarinet.test({
  name: "Ensure can pause and resume subscription",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    const wallet_2 = accounts.get("wallet_2")!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        "flex-nest",
        "create-plan", 
        [types.uint(1), types.ascii("Basic Plan"), types.uint(100), types.uint(30)],
        wallet_1.address
      ),
      Tx.contractCall(
        "flex-nest",
        "subscribe",
        [types.uint(1)],  
        wallet_2.address
      ),
      Tx.contractCall(
        "flex-nest",
        "pause-subscription",
        [types.uint(1)],
        wallet_2.address
      ),
      Tx.contractCall(
        "flex-nest", 
        "resume-subscription",
        [types.uint(1)],
        wallet_2.address
      )
    ]);
    
    assertEquals(block.receipts[2].result.expectOk(), true);
    assertEquals(block.receipts[3].result.expectOk(), true);
  }
});
