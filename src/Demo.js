import React from "react";
import { TreeTable, TreeState } from 'cp-react-tree-table';
import "./Demo.css"
class Demo extends React.Component {
    constructor(props) {
        super(props);
      
      this.state = {
        treeValue: props.data
      };
    }
    
    render() {
      const { treeValue } = this.state;
      
      return (
          <TreeTable
            value={treeValue}
            onChange={this.handleOnChange}>
          <TreeTable.Column basis="800px" grow="0"
            renderCell={this.renderIndexCell}
            renderHeaderCell={() => <span>Id</span>}/>
          <TreeTable.Column
            renderCell={this.renderEditableCell}
            renderHeaderCell={() => <span>Referral Code</span>}/>
        </TreeTable>
      );
    }
    
    handleOnChange = (newValue) => {
      this.setState({ treeValue: newValue });
    }
    
    renderIndexCell = (row) => {
      return (
        <div style={{ paddingLeft: (row.metadata.depth * 15) + 'px'}}
          className={row.metadata.hasChildren ? 'with-children' : 'without-children'}>
          
          {(row.metadata.hasChildren)
            ? (
                <button className="toggle-button" onClick={row.toggleChildren}></button>
              )
            : ''
          }
          
          <span>{row.data.id} ({this.getLength(row)})</span>
        </div>
      );
    }
    renderEditableCell = (row) => {
      return (
        <input type="text" value={row.data.referralCode}
          onChange={(event) => {
            row.updateData({
              ...row.data,
              referralCode: event.target.value,
            });
          }}/>
      );
    }

    getLength = (row) => {
        return row.data.totalLength
      }
  }
export default Demo