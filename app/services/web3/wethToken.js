import { wethToken } from "../../constants/contracts"
import { sendTransaction, callMany, toWei, unix2datetime } from "./base";

const wethTokenAbi = wethToken.abi;
export const wethTokenAddress = wethToken.address;
let contractInstance;

const initContractInstance = () => {
    if (!contractInstance || web3.currentProvider.isMetaMask !== contractInstance.currentProvider.isMetaMask) {
        contractInstance = new web3.eth.Contract(wethTokenAbi, wethTokenAddress);
    }
}

export const approve = async (contractAddress, data, from) => {
    initContractInstance(contractAddress);
    const method = contractInstance.methods.approve(
        data.spender,
        toWei(data.amount, "ether"));

    const txHash = await sendTransaction(method, from);

    return txHash;
}

export const transfer = async (contractAddress, data, from) => {
    initContractInstance(contractAddress);
    const method = contractInstance.methods.transfer(
        data.to,
        toWei(data.amount, "ether"));

    const txHash = await sendTransaction(method, from);

    return txHash;
}

export const transferFrom = async (contractAddress, data, from) => {
    initContractInstance(contractAddress);
    const method = contractInstance.methods.transferFrom(
        data.from,
        data.to,
        toWei(data.amount, "ether"));
    const txHash = await sendTransaction(method, from);

    return txHash;
}


export const withdraw = async (contractAddress, data, from) => {
    initContractInstance(contractAddress);
    const method = contractInstance.methods.withdraw(
        toWei(data.amount, "ether"));

    const txHash = await sendTransaction(method, from);

    return txHash;
}

export const deposit = async (contractAddress, data, from) => {
    initContractInstance(contractAddress);
    const method = contractInstance.methods.deposit();

    const txHash = await sendTransaction(method, from, data.amount);

    return txHash;
}

export const call = async (contractAddress, methods) => {
    initContractInstance(contractAddress);
    let response = [];
    for (const method of methods) {
        let result;
        if (method.args) {
            result = await contractInstance.methods[method.methodName].apply(null, method.args).call(method.opts);
        } else {
            result = await contractInstance.methods[method.methodName]().call(method.opts);
        }
        response.push(result);
    }
    return response;
}