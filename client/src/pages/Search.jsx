import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ItemProduct from "./../components/ItemProduct";
import axios from "axios";

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [listCategory, setListCategory] = useState([]);

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const getProducts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await axios.get(`/api/product/get-product?${searchQuery}`);
      const data = res.data;
      if (!data.success) {
        setLoading(false);
        return;
      }
      if (data.success) {
        setProducts(data.products);

        setLoading(false);
        if (data.products.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    getProducts();
  }, [location.search]);

  //Xữ lý các ô select tìm kiếm
  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfProducts = products.length;
    const startIndex = numberOfProducts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await axios.get(`/api/product/get-product?${searchQuery}`);
    const data = res.data;
    if (!data.success) {
      return;
    }
    if (data.success) {
      setProducts([...products, ...data.products]);
      if (data.products.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  //Load danh mục
  const getAllCategory = async (req, res) => {
    try {
      const res = await axios.get(`/api/category/get-category`);
      const data = res.data;
      if (data.success) {
        setListCategory(data.category);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex   items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Từ tìm kiếm:
            </label>
            <TextInput
              placeholder="Tìm kiếm..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sắp xếp:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Mới nhất</option>
              <option value="asc">Cũ nhất</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Danh mục:</label>

            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="" defaultValue>
                Lựa chọn danh mục
              </option>
              {listCategory.map((item, index) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </Select>
            {/* <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">JavaScript</option>
            </Select> */}
          </div>
          <Button type="submit" color="blue">
            Áp dụng tìm kiếm
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 ">
          Kết quả trả về:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && products.length === 0 && (
            <p className="text-xl text-gray-500">Không tìm thấy kết quả.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Đang tải...</p>}
          <div className=" max-w-6xl mx-auto py-12 xl:py-28 xl:w-[88%]">
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {!loading &&
                products &&
                products.map((product) => (
                  <ItemProduct key={product._id} product={product} />
                ))}
            </div>
          </div>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Hiển thị thêm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
