import axios from "axios";
import React, {useState } from "react";
import {Tree } from 'react-tree-graph';
import {stratify} from 'd3-hierarchy'
import 'react-tree-graph/dist/style.css'

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

  const onClickSearch = async () => {
    let queryString = prepareString();
    options.data.query = queryString;
    const result = await axios.request(options);
    let user = result.data.data.user;
    let listResult = [];
    appendResult(user, listResult, 0);
    console.log(listResult)
    setResult(listResult);
  };

  const getPadding = (level) => {
    let val=10;
    for (let i = 0 ;i< level;i++) {
      val+=25;
    }
    return val;
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
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th>Level</th>
                <th>Wallet address</th>
                <th>Referral Code</th>
              </tr>
            </thead>
            <tbody>
            {result.map((val, key) => {
              return (
                <tr key={key}>
                  <td style={{paddingLeft: getPadding(val.level)}}>{val.level} ({val.total})</td>
                  <td>{val.id}</td>
                  <td>{val.referralCode}</td>
                </tr>
              )
            })}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}
