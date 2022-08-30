import axios from "axios";
import React, {useState } from "react";
import 'react-tree-graph/dist/style.css'
import { TreeTable, TreeState } from 'cp-react-tree-table';
import Demo from "./Demo";

const options = {
  method: "POST",
  url: "https://api.thegraph.com/subgraphs/name/thanhct/gofit-prod",
  headers: {
    "content-type": "application/json",
  },
  data: {
    query: "",
  },
};

export default function App() {
  const [wallet, setWallet] = useState("");
  const [number, setNumber] = useState(0);
  const [result, setResult] = useState();
  const [treeResult, setTreeResult] = useState();

  const prepareString = () => {
    let queryString = `query { user(id: "${wallet}") { id referralCode `;
    for (let i = 1; i <= number; i++) {
      queryString = queryString.concat("referralTos { id referralCode ");
    }
    for (let i = 0; i <= number; i++) {
      queryString = queryString.concat("}");
    }
    queryString = queryString.concat("}");
    return queryString;
  };

  const appendResult = (user, listResult, level) => {
    let currentUser = {};
    currentUser.id = user.id;
    currentUser.level = level;
    currentUser.total = user.referralTos ? user.referralTos.length : 0;
    currentUser.referralCode = user.referralCode;
    listResult.push(currentUser);
    if (user.referralTos) {
      for (let i = 0; i < user.referralTos.length; i++) {
        appendResult(user.referralTos[i], listResult, level+1);
      }
    }
  }

  const handleObject = (user) => {
    let object = {}
    object.data = {id: user.id, referralCode: user.referralCode}
    let children = [];
    if (user.referralTos) {
      for (let i = 0;i<user.referralTos.length;i++){
        let newUser = handleObject(user.referralTos[i]);
        children.push(newUser);
      }
    }
    object.data.totalLength = children.length;
    object.children = children;
    return object;
  }

  const onClickSearch = async () => {
    let queryString = prepareString();
    options.data.query = queryString;
    const result = await axios.request(options);
    let user = result.data.data.user;
    let data = [handleObject(user)];
    setTreeResult(TreeState.create(data))
    let listResult = [];
    appendResult(user, listResult, 0);  
    setResult(listResult);
  };

  const getListTotal = () => {
    let total = [];
    for (let i =0;i<=number;i++) {
      total.push(0);
    } 
    for (let i =0;i<result.length; i++) {
      total[result[i].level] = total[result[i].level] + 1;
    }
    return total;
  }

  return (
    <div>
      <div>
        <span>
          Enter a wallet address:
          <input
            type="text"
            placeholder="Wallet address"
            onChange={(e) => setWallet(e.target.value)}
          />
        </span>
      </div>
      <br></br>
      <div>
        <span>
          Enter number node:
          <input
            type="number"
            placeholder="Number node"
            onChange={(e) => setNumber(e.target.value)}
          />
        </span>
      </div>
      <button onClickCapture={onClickSearch}>Click on me</button>
      <div>
        {result !== undefined && 
          <Demo data={treeResult}/>
        }
      </div>

      <div>
        {result !== undefined && 
        getListTotal().map((val, key) => {
          return (
            <p>Number total F{key}: {val} </p>
          )
        })
        }
      </div>
      <div>
        {result !== undefined && 
        <p>Total all: {result.length}</p>
        }
      </div>
    </div>
  );
}
