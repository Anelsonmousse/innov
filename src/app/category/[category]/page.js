import axios from "axios"; // Import Axios
import CategoryDisplay from "@/components/categoryDisplay";

// Fetch products by category and user location using Axios and FormData
const fetchProductsByCategory = async (category, userLocation) => {
    try {
        // Create FormData and append the necessary fields
        const formData = new FormData();
        formData.append("university", "University of Benin");
        formData.append("category", category);
        formData.append("requestID", "rid_1983");
        console.log(formData);

        // Make the POST request using Axios
        const response = await axios.post(
            "https://api.vplaza.com.ng/products/getProductByUniCat",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data", // Ensure the content type is set to multipart/form-data
                },
            }
        );

        // Check if the response is successful
        if (response.status !== 200) {
            throw new Error("Failed to fetch products");
        }
        console.log(response.data.data);
        return response.data;
       
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

// Page component
const CategoryPage = async ({ params }) => {
    const { category } = await params; // Await params for dynamic route
    
    // State to hold user data after it's fetched on the client side
    // const [userData, setUserData] = useState([]);

    // useEffect(() => {
    //     // Check if localStorage is available before accessing it
    //     if (typeof window !== 'undefined') {
    //         const storedUserData = JSON.parse(localStorage.getItem("userData"));
    //         if (storedUserData && storedUserData.user_location) {
    //             setUserData(storedUserData);
    //         }
    //     }
    // }, []); // Empty dependency array ensures this runs only once on the client side

    // if (!userData || !userData.user_location) {
    //     return <div>Error: User data or location not found</div>;
    // }

    try {
        // Fetch products for the given category and user location
        const products = await fetchProductsByCategory(category);
        return <CategoryDisplay category={category} products={products} />;
    } catch (error) {
        console.error("Error rendering category page:", error);
        return <div>Error loading products for {category}</div>;
    }
};

export default CategoryPage;
