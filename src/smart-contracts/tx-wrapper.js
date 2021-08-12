import {store} from '@/store/index'

const Self = {
  doTransaction: async (contractCall, dialog, wait = 1) => {
    var txHash
    try {
      if (dialog) {
        dialog.open()
      }
      var txn = await contractCall
      txHash = txn.hash
      if (dialog) {
        dialog.close()
      }
      store.commit('addPendingTx', txn.hash)
      var receipt = await txn.wait(wait)
      // console.log(receipt)
      store.commit('completePendingTx', receipt.transactionHash)
      return {
        txn: txn,
        receipt: receipt
      }
    } catch (error) {
      if (dialog) {
        dialog.close()
      }
      console.log(error)
      store.commit('failPendingTx', txHash)
      throw error
    }
  },
}

export default Self