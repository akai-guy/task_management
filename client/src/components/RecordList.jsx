import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Record = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.title}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.category}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.date}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.status}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          onClick={pageChange=true}
          className="bg-sky-100 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-sky-300 h-9 rounded-md px-3"
          to={`/edit/${props.record._id}`}
        >
          Edit
        </Link>
        <button
          className="bg-sky-100 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-sky-300 hover:text-accent-foreground h-9 rounded-md px-3"
          color="red"
          type="button"
          onClick={() => {
            props.deleteRecord(props.record._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);
var firstRender = false;
var pageChange = false;
export default function RecordList() {
  const [records, setRecords] = useState([]);

  // This method fetches the records from the database.
  useEffect(() => {
    async function getRecords() {
      if(firstRender || !pageChange){
        return;
      }
      const response = await fetch(`http://localhost:5050/record/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const records = await response.json();
      setRecords(records);
    }
    getRecords();
    firstRender = true;
    return;
  }, [records.length]);

  // This method will delete a record
  async function deleteRecord(id) {
    await fetch(`http://localhost:5050/record/${id}`, {
      method: "DELETE",
    });
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  async function getRecordsReuse() {
    const response = await fetch(`http://localhost:5050/record/`);
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      console.error(message);
      return;
    }
    let records = await response.json();
    if(document.getElementById("category").value=="All"){
      let recordsFilter = records.filter(c => c.status==document.getElementById("status").value
        || document.getElementById("status").value=="All");
      
      if(document.getElementById("sortdate").value=="All"){
        recordsFilter.sort((a,b)=>{
          return (a._id.toString()).localeCompare(b._id.toString());
        })
      }
      else{
        if(document.getElementById("sortdate").value=="Ascending"){
          recordsFilter.sort((a,b)=>{
            return a.date.localeCompare(b.date);
          })
        }
        if(document.getElementById("sortdate").value=="Descending"){
          recordsFilter.sort((b,a)=>{
            return a.date.localeCompare(b.date);
          })
        }
      }
      setRecords([...recordsFilter]);
    }
    else{
      let recordsFilter = records.filter(c => c.category==document.getElementById("category").value
      && (c.status==document.getElementById("status").value||document.getElementById("status").value=="All"));
      if(document.getElementById("sortdate").value=="All"){
        recordsFilter.sort((a,b)=>{
          return (a._id.toString()).localeCompare(b._id.toString());
        })
      }
      else{
        if(document.getElementById("sortdate").value=="Ascending"){
          recordsFilter.sort((a,b)=>{
            return a.date.localeCompare(b.date);
          })
        }
        if(document.getElementById("sortdate").value=="Descending"){
          recordsFilter.sort((b,a)=>{
            return a.date.localeCompare(b.date);
          })
        }
      }
      
      setRecords([...recordsFilter]);
      //updateCat=false;
    }

  }

  // This method will map out the records on the table
  function recordList() {
    return records.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }


  // This following section will display the table with the records of individuals.
  return (
    <>
      <h3 className="text-lg font-semibold p-4 inline-block" >Tasks</h3>
      <Link onClick={pageChange=true} className="inline-block float-right bg-sky-100 inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-sky-300 h-9 rounded-md px-3" to="/">
          Home
      </Link>
      <Link onClick={pageChange=true} className="inline-block float-right bg-sky-100 inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-sky-300 h-9 rounded-md px-3" to="/create">
          Create Task
      </Link>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="bg-white w-full caption-bottom text-sm">
            <thead className="[&amp;_tr]:border-b bg-sky-100">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Title
                </th>
                <th className="inline-block h-13 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Category
                  <select
                    name="category"
                    id="category"
                    className="m-2 ml-4 inline-block bg-white block flex-1 border rounded-lg bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="All"
                    onChange={() => getRecordsReuse()}
                  >
                    <option value="All">All</option>
                    <option value="Academic">Academic</option>
                    <option value="Athletic">Athletic</option>
                    <option value="Career">Career</option>
                    <option value="Health">Health</option>
                    <option value="Financial">Financial</option>
                    <option value="Personal">Personal</option>
                    <option value="Relationship">Relationship</option>
                    <option value="Spiritual">Spiritual</option>
                    <option value="Other">Other</option>
                  </select>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Goal Date
                  <select
                    name="sortdate"
                    id="sortdate"
                    className="m-2 ml-4 inline-block bg-white block flex-1 border rounded-lg bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Any"
                    onChange={() => getRecordsReuse()}
                  >
                    <option value="Any">Any</option>
                    <option value="Ascending">Ascending</option>
                    <option value="Descending">Descending</option>
                  </select>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Status
                  <select
                    name="status"
                    id="status"
                    className="m-2 ml-4 inline-block bg-white block flex-1 border rounded-lg bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="All"
                    onChange={() => getRecordsReuse()}
                  >
                    <option value="All">All</option>
                    <option value="Incomplete">Incomplete</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Complete">Complete</option>
                  </select>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              {recordList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}