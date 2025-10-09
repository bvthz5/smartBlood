import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';
import DashboardLayout from '../../components/admin/DashboardLayout';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Building2,
  MapPin,
  Calendar,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Shield,
  ShieldOff,
  CheckCircle,
  XCircle
} from 'lucide-react';
import './HospitalManagement.css';

const HospitalManagementContent = () => {
  const { theme } = useTheme();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    district: '',
    city: '',
    is_verified: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 20,
    total: 0,
    pages: 0
  });
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    city: '',
    license_number: '',
    is_verified: false
  });

  // Mock data for development
  const mockHospitals = [
    {
      id: 1,
      name: 'City General Hospital',
      email: 'info@citygeneral.com',
      phone: '+91-9876543210',
      address: '123 Medical Street, Health District',
      district: 'Ernakulam',
      city: 'Kochi',
      license_number: 'HOS001',
      is_verified: true,
      created_at: '2023-06-15T10:30:00Z',
      updated_at: '2024-01-20T14:25:00Z'
    },
    {
      id: 2,
      name: 'Metro Medical Center',
      email: 'contact@metromedical.com',
      phone: '+91-9876543211',
      address: '456 Healthcare Avenue, Medical Zone',
      district: 'Thiruvananthapuram',
      city: 'Thiruvananthapuram',
      license_number: 'HOS002',
      is_verified: false,
      created_at: '2023-05-20T09:15:00Z',
      updated_at: '2024-01-18T11:45:00Z'
    },
    {
      id: 3,
      name: 'Regional Hospital',
      email: 'admin@regionalhospital.com',
      phone: '+91-9876543212',
      address: '789 Health Boulevard, Care District',
      district: 'Kozhikode',
      city: 'Kozhikode',
      license_number: 'HOS003',
      is_verified: true,
      created_at: '2023-08-10T16:20:00Z',
      updated_at: '2024-01-10T08:30:00Z'
    }
  ];

  const districts = ['Ernakulam', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Alappuzha', 'Palakkad'];
  const cities = ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Alappuzha', 'Palakkad'];

  useEffect(() => {
    fetchHospitals();
  }, [pagination.page, searchTerm, filters]);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      // Simulate API call - use requestIdleCallback for better performance
      await new Promise(resolve => {
        if (window.requestIdleCallback) {
          requestIdleCallback(() => resolve(), { timeout: 1000 });
        } else {
          setTimeout(resolve, 1000);
        }
      });
      
      // Filter mock data based on search and filters
      let filteredHospitals = [...mockHospitals];
      
      if (searchTerm) {
        filteredHospitals = filteredHospitals.filter(hospital =>
          hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.phone.includes(searchTerm) ||
          hospital.license_number.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (filters.district) {
        filteredHospitals = filteredHospitals.filter(hospital => hospital.district === filters.district);
      }
      
      if (filters.city) {
        filteredHospitals = filteredHospitals.filter(hospital => hospital.city === filters.city);
      }
      
      if (filters.is_verified) {
        const isVerified = filters.is_verified === 'verified';
        filteredHospitals = filteredHospitals.filter(hospital => hospital.is_verified === isVerified);
      }
      
      setHospitals(filteredHospitals);
      setPagination(prev => ({
        ...prev,
        total: filteredHospitals.length,
        pages: Math.ceil(filteredHospitals.length / prev.per_page)
      }));
    } catch (err) {
      setError('Failed to fetch hospitals');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ district: '', city: '', is_verified: '' });
    setSearchTerm('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleAddHospital = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      district: '',
      city: '',
      license_number: '',
      is_verified: false
    });
    setShowAddModal(true);
  };

  const handleEdit = (hospital) => {
    setSelectedHospital(hospital);
    setFormData({
      name: hospital.name,
      email: hospital.email,
      phone: hospital.phone,
      address: hospital.address,
      district: hospital.district,
      city: hospital.city,
      license_number: hospital.license_number,
      is_verified: hospital.is_verified
    });
    setShowEditModal(true);
  };

  const handleDelete = (hospital) => {
    setSelectedHospital(hospital);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    try {
      // Simulate API call - use requestIdleCallback for better performance
      await new Promise(resolve => {
        if (window.requestIdleCallback) {
          requestIdleCallback(() => resolve(), { timeout: 1000 });
        } else {
          setTimeout(resolve, 1000);
        }
      });
      
      if (showAddModal) {
        // Add new hospital
        const newHospital = {
          id: Date.now(),
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setHospitals(prev => [newHospital, ...prev]);
        setShowAddModal(false);
      } else {
        // Update existing hospital
        setHospitals(prev => prev.map(hospital => 
          hospital.id === selectedHospital.id 
            ? { ...hospital, ...formData, updated_at: new Date().toISOString() }
            : hospital
        ));
        setShowEditModal(false);
      }
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        district: '',
        city: '',
        license_number: '',
        is_verified: false
      });
      setSelectedHospital(null);
    } catch (err) {
      setError('Failed to save hospital');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      // Simulate API call - use requestIdleCallback for better performance
      await new Promise(resolve => {
        if (window.requestIdleCallback) {
          requestIdleCallback(() => resolve(), { timeout: 1000 });
        } else {
          setTimeout(resolve, 1000);
        }
      });
      setHospitals(prev => prev.filter(hospital => hospital.id !== selectedHospital.id));
      setShowDeleteModal(false);
      setSelectedHospital(null);
    } catch (err) {
      setError('Failed to delete hospital');
    } finally {
      setActionLoading(false);
    }
  };

  const getVerificationBadge = (isVerified) => (
    <span className={`verification-badge ${isVerified ? 'verified' : 'unverified'}`}>
      {isVerified ? (
        <>
          <CheckCircle size={14} />
          Verified
        </>
      ) : (
        <>
          <XCircle size={14} />
          Unverified
        </>
      )}
    </span>
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && hospitals.length === 0) {
    return (
      <div className="hospital-management-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading hospitals...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="hospital-management">
      {/* Header */}
      <div className="hospital-header">
        <div className="header-content">
          <div className="header-title">
            <Building2 size={28} />
            <h1>Hospital Management</h1>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">
              <Download size={16} />
              Export
            </button>
            <button className="btn-primary" onClick={handleAddHospital}>
              <Plus size={16} />
              Add Hospital
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="hospital-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <Building2 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{pagination.total}</div>
            <div className="stat-label">Total Hospitals</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon verified">
            <Shield size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {hospitals.filter(h => h.is_verified).length}
            </div>
            <div className="stat-label">Verified</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon unverified">
            <ShieldOff size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {hospitals.filter(h => !h.is_verified).length}
            </div>
            <div className="stat-label">Unverified</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon districts">
            <MapPin size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {new Set(hospitals.map(h => h.district)).size}
            </div>
            <div className="stat-label">Districts</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="hospital-controls">
        <div className="search-section">
          <div className="search-input">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search hospitals by name, email, phone, or license..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filters-section">
          <div className="filter-group">
            <label>District</label>
            <select
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
            >
              <option value="">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>City</label>
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Verification Status</label>
            <select
              value={filters.is_verified}
              onChange={(e) => handleFilterChange('is_verified', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
          
          <button className="clear-filters" onClick={clearFilters}>
            <RefreshCw size={16} />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Hospitals Table */}
      <div className="hospital-table-container">
        <div className="table-header">
          <div className="table-title">
            <span>Hospitals List</span>
            <span className="table-count">({pagination.total} hospitals)</span>
          </div>
        </div>
        
        <div className="table-wrapper">
          <table className="hospital-table">
            <thead>
              <tr>
                <th>Hospital</th>
                <th>Contact</th>
                <th>Location</th>
                <th>License</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.map((hospital) => (
                <tr key={hospital.id}>
                  <td>
                    <div className="hospital-info">
                      <div className="hospital-avatar">
                        <Building2 size={20} />
                      </div>
                      <div className="hospital-details">
                        <div className="hospital-name">{hospital.name}</div>
                        <div className="hospital-address">{hospital.address}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="contact-item">
                        <Mail size={14} />
                        {hospital.email}
                      </div>
                      <div className="contact-item">
                        <Phone size={14} />
                        {hospital.phone}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="location-info">
                      <div className="location-item">
                        <MapPin size={14} />
                        {hospital.city}, {hospital.district}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="license-info">
                      <span className="license-number">{hospital.license_number}</span>
                    </div>
                  </td>
                  <td>{getVerificationBadge(hospital.is_verified)}</td>
                  <td>
                    <div className="created-date">
                      <Calendar size={14} />
                      {formatDate(hospital.created_at)}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEdit(hospital)}
                        title="Edit Hospital"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(hospital)}
                        title="Delete Hospital"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <div className="pagination-info">
            Page {pagination.page} of {pagination.pages}
          </div>
          
          <button 
            className="pagination-btn"
            disabled={pagination.page === pagination.pages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Add Hospital Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Hospital</h3>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Hospital Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>License Number</label>
                  <input
                    type="text"
                    value={formData.license_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Address *</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    required
                    rows={3}
                  />
                </div>
                
                <div className="form-group">
                  <label>District *</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                    required
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_verified}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_verified: e.target.checked }))}
                    />
                    <span>Verified Hospital</span>
                  </label>
                </div>
              </div>
            </form>
            <div className="modal-footer">
              <button 
                type="button"
                className="btn-secondary"
                onClick={() => setShowAddModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn-primary"
                onClick={handleFormSubmit}
                disabled={actionLoading}
              >
                {actionLoading ? 'Adding...' : 'Add Hospital'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Hospital Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Hospital</h3>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Hospital Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>License Number</label>
                  <input
                    type="text"
                    value={formData.license_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Address *</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    required
                    rows={3}
                  />
                </div>
                
                <div className="form-group">
                  <label>District *</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                    required
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_verified}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_verified: e.target.checked }))}
                    />
                    <span>Verified Hospital</span>
                  </label>
                </div>
              </div>
            </form>
            <div className="modal-footer">
              <button 
                type="button"
                className="btn-secondary"
                onClick={() => setShowEditModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn-primary"
                onClick={handleFormSubmit}
                disabled={actionLoading}
              >
                {actionLoading ? 'Updating...' : 'Update Hospital'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Delete Hospital</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{selectedHospital?.name}</strong>?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                className="btn-danger"
                onClick={confirmDelete}
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HospitalManagement = () => {
  return (
    <ThemeProvider>
      <DashboardLayout>
        <HospitalManagementContent />
      </DashboardLayout>
    </ThemeProvider>
  );
};

export default HospitalManagement;

