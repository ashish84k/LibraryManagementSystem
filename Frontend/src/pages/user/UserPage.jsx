import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Book, LogOut, RefreshCcw } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function UserPage() {
  const [books, setBooks] = useState([]);
  const [myBorrows, setMyBorrows] = useState([]);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("lmsToken");

  const api = axios.create({
    baseURL: "https://librarymanagementsystem-p7l6.onrender.com",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchBooks = async () => {
    try {
      const { data } = await api.get("/book");
      setBooks(data);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired, please login again");
        handleLogout();
      } else
        toast.error(err.response?.data?.message || "Failed to fetch books");
    }
  };

  const fetchMyBorrows = async () => {
    try {
      const { data } = await api.get("/borrow/my-borrows");
      setMyBorrows(data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch borrowed books"
      );
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/auth/login", { replace: true });
    } else {
      const storedUser = JSON.parse(localStorage.getItem("lmsUser"));
      setUser(storedUser);
      fetchBooks();
      fetchMyBorrows();
    }
  }, []);

  const handleBorrow = async (bookId) => {
    try {
      const { data } = await api.post("/borrow", { bookId });
      console.log(data);
      toast.success(data.message);
      fetchBooks();
      fetchMyBorrows();
    } catch (err) {
      console.error("Borrow error:", err.response || err);
      toast.error(err.response?.data?.message || "Error borrowing book");
    }
  };

  const handleReturn = async (bookId) => {
    try {
      const { data } = await api.post("/borrow/return", { bookId });
      toast.success(data.message);
      fetchBooks();
      fetchMyBorrows();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("lmsToken");
    localStorage.removeItem("lmsUser");
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      <aside className="w-full lg:w-64 bg-white shadow-md p-4 space-y-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold">
            <Book className="w-6 h-6 text-primary" />
            <span>User Panel</span>
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

      <main className="flex-1 p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>📚 Book Catalog</CardTitle>
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
                    <TableHead>Available</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.genre}</TableCell>
                      <TableCell>{book.availableCopies}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          className="cursor-pointer"
                          disabled={book.availableCopies <= 0}
                          onClick={() => handleBorrow(book.id)}
                        >
                          {book.availableCopies > 0 ? "Borrow" : "Unavailable"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>📖 My Borrowed Books</CardTitle>
          </CardHeader>
          <CardContent>
            {myBorrows.length === 0 ? (
              <p className="text-center text-gray-500">
                You haven’t borrowed any books yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Borrow Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myBorrows.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book?.book?.title}</TableCell>
                      <TableCell>
                        {new Date(book.borrowDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="cursor-pointer flex items-center gap-1"
                          onClick={() => handleReturn(book.bookId)}
                        >
                          <RefreshCcw className="w-4 h-4" />
                          Return
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
    </div>
  );
}
