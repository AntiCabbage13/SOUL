/* useEffect(() => {
  const fetchData = async () => {
    try {
      if (senderObjectId && objectId) {
        // Fetch left bubble messages and image URLs
        const [leftBubbleMessages, fetchedImageUrlsData] = await Promise.all([
          fetchLeftBubbleMessages(objectId, senderObjectId),
          fetchImageUrls(objectId, senderObjectId),
        ]);

        // Map fetched image URLs to the left bubble messages
        const mappedLeftMessages = leftBubbleMessages.map((message) => {
          const imageUrl = fetchedImageUrlsData.find(
            (imageUrl) => imageUrl._id === message._id
          );
          return {
            ...message,
            position: "left",
            user: {
              _id: message.user._id,
              name: "User Name",
            },
            image: imageUrl ? imageUrl.url : null,
          };
        });

        // Combine left bubble messages, text messages, and image messages
        const combinedMessages = [
          ...mappedLeftMessages,
          ...textMessages.map((message) => ({
            ...message,
            position: "right",
            user: {
              _id: message.user._id,
              name: "User Name",
            },
          })),
          ...imageMessages.map((message) => ({
            ...message,
            position: "right",
            user: {
              _id: message.user._id,
              name: "User Name",
            },
          })),
        ];

        // Sort combined messages by createdAt
        combinedMessages.sort((a, b) => b.createdAt - a.createdAt);

        // Map fetched image URLs to the combined messages
        const messagesWithImageUrls = combinedMessages.map((message) => {
          const imageUrl = fetchedImageUrlsData.find(
            (imageUrl) => imageUrl._id === message._id
          );
          return {
            ...message,
            image: imageUrl ? imageUrl.url : message.image,
          };
        });

        // Set the combined messages state variable
        setMessages(messagesWithImageUrls);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, [objectId, senderObjectId, textMessages, imageMessages]); */