import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Book, PlusCircle, Trash2, Edit, LogOut } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminPage() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("lmsToken");

  const api = axios.create({
    baseURL: "https://librarymanagementsystem-p7l6.onrender.com",
    headers: {
      Authorization: `Bearer ${token}`, // 🔑 token added
    },
  });

  const fetchBooks = async () => {
    try {
      const { data } = await api.get("/book");
      setBooks(data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired, please login again");
        handleLogout();
      } else {
        toast.error("Failed to fetch books");
      }
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/auth/login", { replace: true });
    } else {
      const storedUser = JSON.parse(localStorage.getItem("lmsUser"));
      setUser(storedUser);
      fetchBooks();
    }
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newBook = Object.fromEntries(formData.entries());

    try {
      await api.post("/book", newBook);
      toast.success("Book added successfully");
      setOpenAdd(false);
      fetchBooks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding book");
    }
  };

  const handleEditBook = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedBook = Object.fromEntries(formData.entries());

    try {
      await api.put(`/book/${selectedBook.id}`, updatedBook);
      toast.success("Book updated successfully");
      setOpenEdit(false);
      setSelectedBook(null);
      fetchBooks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating book");
    }
  };

  const handleDeleteBook = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      await api.delete(`/book/${id}`);
      toast.success("Book deleted successfully");
      fetchBooks();
    } catch {
      toast.error("Error deleting book");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("lmsToken");
    localStorage.removeItem("lmsUser");
    navigate("/auth/login", { replace: true });
  };

  const availableCopies = (book) => book.totalCopies - book.borrowed;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      <aside className="w-full lg:w-64 bg-white shadow-md p-4 space-y-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold">
            <Book className="w-6 h-6 text-primary" />
            <span>Admin Panel</span>
          </div>

          {user && (
            <div className="mt-6 p-3 bg-gray-100 rounded-lg text-sm">
              <p className="font-semibold">👤 {user.name}</p>
              <p className="text-gray-600">Role: {user.role}</p>
            </div>
          )}
        </div>

        <div>
          <Button
            variant="destructive"
            className="w-full flex items-center gap-2 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Books Management</h1>
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleAddBook}>
                <Input name="title" placeholder="Title" required />
                <Input name="author" placeholder="Author" required />
                <Input name="genre" placeholder="Genre" required />
                <Input
                  name="totalCopies"
                  type="number"
                  placeholder="Total Copies"
                  required
                />
                <Button type="submit" className="w-full cursor-pointer">
                  Save
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>All Books</CardTitle>
          </CardHeader>
          <CardContent>
            {books.length === 0 ? (
              <p className="text-center text-gray-500">No books available</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Total Copies</TableHead>
                    <TableHead>Borrowed</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.genre}</TableCell>
                      <TableCell>{book.totalCopies}</TableCell>
                      <TableCell>{book.borrowed}</TableCell>
                      <TableCell>{availableCopies(book)}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedBook(book);
                            setOpenEdit(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <form className="space-y-4" onSubmit={handleEditBook}>
              <Input
                name="title"
                defaultValue={selectedBook.title}
                placeholder="Title"
                required
              />
              <Input
                name="author"
                defaultValue={selectedBook.author}
                placeholder="Author"
                required
              />
              <Input
                name="genre"
                defaultValue={selectedBook.genre}
                placeholder="Genre"
                required
              />
              <Input
                name="totalCopies"
                type="number"
                defaultValue={selectedBook.totalCopies}
                placeholder="Total Copies"
                required
              />
              <Button type="submit" className="w-full cursor-pointer">
                Update
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
