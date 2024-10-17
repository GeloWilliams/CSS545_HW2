# Various Approaches to Storage Management on Android (React Native)

## Overview
This app functions as a kind of slideshow gallery where the user swipes left or right to view various images. Naturally, the type of data to store are images. The first consideration was whether to store some of the samples in the `assets` folder of the app, but I thought it would be more practical to create an API from my website (containing the images) for scalability. When a user lands on the **Story** page, the app fetches the images.

## Approaches Considered
Considering the size of the data that needs to be stored, I needed a lightweight tool that would be practical. Although images can easily increase the size of the app, fetching them from a server could be a solution. Making use of local caching, **AsyncStorage** seemed like the optimal solution. In the app's current state, I didn't need a remote database like **Firebase**, since the user would only be viewing the media with minimal user input. They could, however, choose a light or dark theme, which could be stored in the local user settings (again, **AsyncStorage** was an obvious choice).

### Alternative Approaches
- **SQLite:** While it could be used to store image references or settings, the setup can be more complex and might be overkill for simple key-value storage or caching.
- **Firebase:** A remote database would be more appropriate if the app needed to sync user data across devices, but for a simple, local media viewer, it would add unnecessary complexity.
- **SecureStore:** Suitable for storing sensitive information securely, but given the nature of this app (media viewing), security concerns weren’t a priority. However, it could be considered for future features like user authentication.

## Caching Images
To avoid unnecessary API calls, **AsyncStorage** was chosen as a practical tool for caching images locally. In combination with **FileSystem** (`expo-file-system`), a structured directory was created for **AsyncStorage** to map the image URIs with the storage keys.

## Pros and Cons of Each Approach

### AsyncStorage
#### Pros
- **Easy Setup:** Quick and straightforward integration.
- **Good for Key-Value Pairs:** Fits the use case for storing settings and cached data.
- **Data Persistence:** Keeps data across app sessions.

#### Cons
- **Not Very Scalable:** May struggle with large datasets.
- **No Data Encryption:** Data isn't secured, which could be an issue if storing sensitive information.

### FileSystem
#### Pros
- **Structured Storage:** Simple to create directories for organization.
- **Handles Large Files Well:** Suitable for storing media like images.
- **Manageable with APIs:** Easy to organize and manage files using the API.

#### Cons
- **Custom Management Complexity:** File organization and cleanup can get tricky.
- **Storage Limitations:** Potentially problematic if many images are stored locally.

### SQLite
#### Pros
- **Supports Complex Queries:** Great for relational data and can handle more complex data structures.
- **Local Database:** Allows for more advanced storage solutions compared to basic key-value storage.

#### Cons
- **Complex Setup:** Requires configuration and understanding of SQL queries.
- **Overkill for Simple Caching:** May be too powerful for straightforward key-value needs like image caching.

### Firebase
#### Pros
- **Cloud-Based Storage:** Useful for syncing data across multiple devices.
- **Scalability:** Easily scales with the app’s growth.
- **Real-Time Data Syncing:** Great for apps with collaborative features or live updates.

#### Cons
- **Requires Internet Connection:** Can’t access data offline without additional setup for offline support.
- **More Complex Integration:** Setting up Firebase requires more initial configuration and familiarity with cloud services.
- **Not Necessary for Local-Only Data:** Adds complexity for a simple app with limited user input.

### SecureStore
#### Pros
- **Encrypted Storage:** Provides a secure way to store sensitive data.
- **Simple API for Storing Key-Value Pairs:** Easy to implement when security is a concern.

#### Cons
- **Limited Use Cases for Media:** Primarily intended for sensitive data, not large file storage.
- **Storage Limits:** Not suitable for storing a large number of images or media files.
