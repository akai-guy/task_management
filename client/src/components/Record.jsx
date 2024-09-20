import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Record() {
  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const days = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
  const [form, setForm] = useState({
    title: "",
    category: "Academic",
    date: (new Date().getFullYear()).toString() + "-" + months[(new Date().getMonth())] + "-" + days[(new Date().getDate()-1)],
    status: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if(!id) return;
      setIsNew(false);
      const response = await fetch(
        `http://localhost:5050/record/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(record);
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    const person = { ...form };
    try {
      let response;
      if (isNew) {
        // if we are adding a new record we will POST to /record.
        response = await fetch("http://localhost:5050/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      } else {
        // if we are updating a record we will PATCH to /record/:id.
        response = await fetch(`http://localhost:5050/record/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    } finally {
      setForm({ title: "", category: "Academic", date: (new Date().getFullYear()).toString() + "-" + months[(new Date().getMonth())] + "-" + days[(new Date().getDate()-1)], status: "" });
      navigate("/records");
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create/Update Task</h3>
      <form
        onSubmit={onSubmit}
        className="bg-white border rounded-lg overflow-hidden p-4"
      >
        <div className="bg-sky-100 p-2 grid grid-cols-1 gap-x-8 gap-y-10 border border-slate-700/10 rounded-lg pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Task Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              These are information fields for your task that can be changed later.<br></br><br></br>
              NOTE: They will be stored publicly, so be careful what you share.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="sm:col-span-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Title
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="bg-white block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Task Title"
                    maxLength="30"
                    value={form.title}
                    onChange={(e) => updateForm({ title: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="category"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Category
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <select
                    name="category"
                    id="category"
                    className="bg-white block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Academic"
                    value={form.category}
                    onChange={(e) => updateForm({ category: e.target.value })}
                    >
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
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="date"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Goal Date
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="date"
                    name="date"
                    id="date"
                    className="bg-white block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    value={form.date}
                    onChange={(e) => updateForm({ date: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div>
              <fieldset className="mt-4">
                <legend className="sr-only">Status</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  <div className="flex items-center">
                    <input
                      id="statusIncomplete"
                      name="statusOptions"
                      type="radio"
                      value="Incomplete"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.status === "Incomplete"}
                      onChange={(e) => updateForm({ status: e.target.value })}
                    />
                    <label
                      htmlFor="statusIncomplete"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      Incomplete
                    </label>
                    <input
                      id="statusInProgress"
                      name="statusOptions"
                      type="radio"
                      value="In Progress"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.status === "In Progress"}
                      onChange={(e) => updateForm({ status: e.target.value })}
                    />
                    <label
                      htmlFor="statusInProgress"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      In Progress
                    </label>
                    <input
                      id="statusComplete"
                      name="statusOptions"
                      type="radio"
                      value="Complete"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.status === "Complete"}
                      onChange={(e) => updateForm({ status: e.target.value })}
                    />
                    <label
                      htmlFor="statusComplete"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      Complete
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Save Task"
          className="bg-sky-100 inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input border-slate-700/10 bg-background hover:bg-sky-300 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
    </>
  );
}