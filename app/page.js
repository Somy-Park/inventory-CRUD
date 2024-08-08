'use client' // Show it's client sided app
import Image from "next/image";
import {useState, useEffect} from "react"
import { doc, collection, getDoc, getDocs, setDoc, Firestore, query, deleteDoc } from "firebase/firestore";
import { Modal, Box, Typography, Stack, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"
import { firestore } from "@/firebase";
import { signOut, useSession } from "next-auth/react";


export default function Home() {
  // Session
  const session = useSession();
  // Initialize states (inventory list, open/closed, item name, search state)
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [displayList, setDisplayList] = useState(inventory);  // Display list set to inventory (display everything by default)
  const [searchItem, setSearchItem] = useState("")

  // Helper function 1: Fetch inventory from firebase and store in a variable
  const updateInventory = async () => { // Async to prevent web from freezing during this process
    // Get document from firestore
    const snapshot = query(collection(firestore, "inventory")); // Get reference to "inventory" collection to prep to fetch its documents
    const docs = await getDocs(snapshot) // Fetch documents according to query (from "inventory" collection)
    // Add document data to inventory list
    const inventoryList = [] // Intialize inventory list
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
      }
    )
    setInventory(inventoryList); // Update inventory state to this list
  }
    // Call update inventory function once when page loads
  useEffect(() => {
    updateInventory()
  }, [])  // update it once when page loads

  useEffect(() => {
    setDisplayList(inventory); // Update displayList with new inventory
  }, [inventory]); // Run when inventory changes
  
  // Helper function 2: Remove items. Then update inventory again
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item) // Get one direct document reference based on item argument
    const docSnap = await getDoc(docRef) 
    if (docSnap.exists()) { // It it exists, remove count by 1
      const {quantity} = docSnap.data() // Get quantity from that doc
      if (quantity == 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await updateInventory()
  }

  // Helper function 3: Add items. Then update inventory again
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item) // Get one direct document reference based on item argument
    const docSnap = await getDoc(docRef) 
    if (docSnap.exists()) { // It it exists, add count by 1
      const {quantity} = docSnap.data() // Get quantity from that doc
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }

  // Helper functions 4: modal helper functions
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Helper function 5: Filter
  const filterItem = async(characters) => {
    const newList = inventory.filter(item =>
      item.name.toLowerCase().includes(characters.toLowerCase())
    )
    if(newList.length == 0) {
      setDisplayList([])
    } else {
      setDisplayList(newList)
    }
  }

  // Helper functions for event handling
  const addItemClick = () => {
    addItem(itemName)
    setItemName("")
    handleClose()
  }

  return (
    <Box // Entire screen 
      width = "100vw"
      height = "100vh"
      display = "flex"
      flexDirection="column"
      justifyContent= "center" // Center horizontally
      alignItems = "center"   // Center vertically
      gap = {2} // Add space between flex items horizontally
    >
      {/* Modal */}
      <Modal // Modal open/close
        open = {open} onClose = {handleClose}
      > 
        
        <Box  // Pop up box 
          position = "absolute" //Center box on screen
          top = "50%"
          left = "50%"
          width = {400}
          bgcolor = "white"
          border = "2px solid #000"
          boxShadow = {24}
          p = {4}
          display = "flex"
          flexDirection="column"
          gap={1}
          sx={{
          transform: "translate(-50%, -50%)"
          }}
        >
          <Typography  // Title in modal box
            variant = "h6"> Add Item
          </Typography>
          <Stack // Layout of items below title
            width = "100%" direction = "row" spacing= {1}
          >
            <TextField // Textfield
              variant = "outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            /> 
            <Button  // Add button 
              variant="outlined" 
              onClick= {addItemClick}
            >
              Add
            </Button>
          </Stack> 
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={() => {
          handleOpen()
        }}
      >
        Add New Item
      </Button>
      {/* Main box */}
      <Box border = "1px solid #333"> 
        <Box 
          border ="1px solid #333" 
          width ="800px" 
          height ="100px" 
          bgcolor="#ADD8E6"
          display="flex"
          justifyContent="center"
          alignItems="center"
        > 
          <Typography variant = "h3" borderRadius={3}>{session?.data?.user?.name}&apos;s Inventory</Typography>
        </Box>
        {/* Search bar box */}
        <Box
          border ="1px solid #333" 
          borderRadius={3}
          width ="800px"
          height ="70px" 
          display ="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="#f0f5f7"
        >
          <TextField
            placeholder="Search Item"
            sx={{ width: "600px"}}
            InputLabelProps={{
              sx: {fontSize: 20}
            }}
            InputProps = {{
              sx: { fontSize: 20}
            }}
            onChange={(e) => {
              setSearchItem(e.target.value) 
            }}
            onBlur={ () => {
              setDisplayList(inventory)
            }}
            onKeyDown= {(e) => {
              if (e.key == "Enter") {
                filterItem(searchItem)
              }
            }}
          />
          <Button 
            variant = "contained" 
            sx ={{height:"60px"}}
            onClick={ () => filterItem(searchItem) }
          >
            <SearchIcon/>
          </Button>
        </Box >
        <Stack direction ="column" overflow = "auto" width = "800px" height = "300px" spacing= {1}>
          {displayList.map(({name, quantity}) => ( 
            <Box 
              key = {name}
              border ="1px solid #333" 
              borderRadius={3}
              width = "100%"
              minHeight ="100px"
              display="flex"
              alignItems={"center"}
              justifyContent={"space-between"}
              padding = {5}
            >
              <Typography variant ="h4" color ="#333" textAlign={"center"}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant ="h4" color ="#333" textAlign={"center"}>
                {quantity}
              </Typography>
              <Stack /* New Layout on the side */direction ="row" spacing = {2}>
                <Button variant = "contained" onClick={() => addItem(name)}>
                  Add
                </Button>
                <Button variant = "contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Stack>
            </Box>
            ))}
        </Stack>
      </Box>
      {/* Log out */}
      <Box > 
        <Button variant = "outlined" onClick={() => signOut()}>Logout</Button>
      </Box>
    </Box>
  );
}
