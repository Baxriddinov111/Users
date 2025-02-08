"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/supabase/client";

const Page = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [logo, setLogo] = useState<string>("");
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("UsersInfo1").select("*");
    if (error) console.error(error);
    else setUsers(data);
    setLoading(false);
  };

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files?.length) return;

    const avatarFile = event.target.files[0];
    const filePath = `logos/${avatarFile.name}.jpg`;
    setLoading(true);

    const { data, error } = await supabase.storage
      .from("Logotip")
      .upload(filePath, avatarFile);
    if (error) {
      console.error(error);
    } else {
      setLogo(data.path);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!name || !age || !email || !logo) {
      alert("Barcha maydonlarni to‘ldiring!");
      return;
    }

    setLoading(true);

    if (edit && editId !== null) {
      // Yangilash
      const { error } = await supabase
        .from("UsersInfo1")
        .update({ Logo: logo, Name: name, Age: age, Email: email })
        .eq("id", editId);
      if (error) {
        console.error(error);
      } else {
        resetForm();
        fetchUsers();
      }
    } else {
      // Yangi qo‘shish
      const { error } = await supabase
        .from("UsersInfo1")
        .insert([{ Logo: logo, Name: name, Age: age, Email: email }]);
      if (error) {
        console.error(error);
      } else {
        resetForm();
        fetchUsers();
      }
    }

    setLoading(false);
  };

  const resetForm = () => {
    setName("");
    setAge("");
    setEmail("");
    setLogo("");
    setEdit(false);
    setEditId(null);
  };

  const deleteTicket = async (id: number) => {
    const { error } = await supabase.from("UsersInfo1").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error);
    } else {
      fetchUsers();
    }
  };

  const editTicket = (user: any) => {
    setEdit(true);
    setEditId(user.id);
    setLogo(user.Logo);
    setName(user.Name);
    setEmail(user.Email);
    setAge(user.Age);
  };

  return (
    <div className="flex items-center justify-center gap-16 h-screen py-4 bg-gray-100">
      <div className="w-1/4 bg-white border rounded-lg shadow-lg h-4/5 p-8">
        <div className="flex justify-center mb-6">
          <label
            htmlFor="id"
            className="w-40 h-40 border-2 border-dashed border-gray-400 rounded-full flex justify-center items-center text-gray-500 hover:bg-gray-100 transition cursor-pointer"
          >
            {logo ? (
              <img
                width={"100%"}
                src={
                  "https://dijgblooocqejrsjbsto.supabase.co/storage/v1/object/public/Logotip/" +
                  logo
                }
                alt="Logo"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              "Upload Logo"
            )}
            <input id="id" onChange={handleLogoUpload} type="file" hidden />
          </label>
        </div>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="form-control mb-3 p-2 border rounded w-full"
          placeholder="Name..."
        />
        <input
          onChange={(e) => setAge(e.target.value)}
          value={age}
          type="text"
          className="form-control mb-3 p-2 border rounded w-full"
          placeholder="Age..."
        />
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="text"
          className="form-control mb-3 p-2 border rounded w-full"
          placeholder="Email..."
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Saving..." : edit ? "Update" : "Save"}
        </button>
        {edit && (
          <button
            onClick={resetForm}
            className="bg-gray-500 text-white w-full py-2 mt-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="w-2/4 bg-white border rounded-lg shadow-lg h-4/5 overflow-y-auto p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-3">Logo</th>
              <th className="p-3">Name</th>
              <th className="p-3">Age</th>
              <th className="p-3">Email</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="p-3 text-center">
                    {user.Logo ? (
                      <img
                        src={
                          "https://dijgblooocqejrsjbsto.supabase.co/storage/v1/object/public/Logotip/" +
                          user.Logo
                        }
                        alt="Logo"
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      "📷"
                    )}
                  </td>
                  <td className="p-3">{user.Name}</td>
                  <td className="p-3">{user.Age}</td>
                  <td className="p-3">{user.Email}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => editTicket(user)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTicket(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
