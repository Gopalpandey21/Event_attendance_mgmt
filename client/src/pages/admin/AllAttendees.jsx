import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // To get the admin's token

const AllAttendees = () => {
  const [attendees, setAttendees] = useState([]); // State to hold the fetched data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const { user } = useAuth(); // Get the admin's login info

  // useEffect to fetch data when the component loads
  useEffect(() => {
    const fetchAttendees = async () => {
      if (!user?.token) {
        setError('You are not authorized to view this page.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/registrations/attendees', {
          headers: {
            'Authorization': `Bearer ${user.token}`, // Send admin token for authentication
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch attendees data.');
        }

        const data = await response.json();
        setAttendees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [user]); // Re-fetch if the user logs in/out

  // useMemo will now process the live data from the 'attendees' state
  const filteredAndSortedAttendees = useMemo(() => {
    // Transform the backend's nested data into a flat structure for the table
    let formattedItems = attendees.map(item => ({
      id: item._id,
      name: item.user.name,
      email: item.user.email,
      eventName: item.event.title,
      checkInDate: new Date(item.checkInTime).toLocaleDateString(),
    }));

    if (searchTerm) {
      formattedItems = formattedItems.filter(attendee =>
        attendee.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    formattedItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return formattedItems;
  }, [attendees, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const styles = {
    // ... your existing styles ...
    message: { textAlign: 'center', fontSize: '18px', color: '#6c757d', padding: '20px' },
  };

  if (loading) return <p style={styles.message}>Loading attendees...</p>;
  if (error) return <p style={{...styles.message, color: 'red'}}>Error: {error}</p>;

  return (
    <div>
      <h1 style={styles.header}>All Event Attendees</h1>
      <div style={styles.container}>
        <input
          type="text"
          placeholder="Search by name..."
          style={styles.searchInput}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table style={styles.table}>
          <thead>
            <tr>
              <th onClick={() => requestSort('name')} style={styles.th}>Name</th>
              <th onClick={() => requestSort('eventName')} style={styles.th}>Event Attended</th>
              <th onClick={() => requestSort('email')} style={styles.th}>Email</th>
              <th onClick={() => requestSort('checkInDate')} style={styles.th}>Check-in Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedAttendees.length > 0 ? (
              filteredAndSortedAttendees.map((attendee, index) => (
                <tr key={attendee.id} style={index % 2 === 0 ? styles.trEven : {}}>
                  <td style={styles.td}>{attendee.name}</td>
                  <td style={styles.td}>{attendee.eventName}</td>
                  <td style={styles.td}>{attendee.email}</td>
                  <td style={styles.td}>{attendee.checkInDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ ...styles.td, textAlign: 'center' }}>No checked-in attendees found yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ... your existing styles object and export

export default AllAttendees;