import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';
import DashboardLayout from '../../components/admin/DashboardLayout';
import {
  Search,
  Filter,
  ClipboardList,
  Building2,
  Droplets,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Eye,
  UserPlus,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Users,
  Loader,
  Target
} from 'lucide-react';
import './DonationRequests.css';

const DonationRequestsContent = () => {
  const { theme } = useTheme();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    blood_group: '',
    hospital_id: '',
    urgency: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 20,
    total: 0,
    pages: 0
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [availableDonors, setAvailableDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState('');

  // Mock data for development
  const mockRequests = [
    {
      id: 1,
      hospital_name: 'City General Hospital',
      hospital_city: 'Kochi',
      hospital_district: 'Ernakulam',
      patient_name: 'Sarah Johnson',
      blood_group: 'O+',
      units_required: 2,
      urgency: 'high',
      status: 'pending',
      description: 'Emergency surgery required for patient',
      contact_person: 'Dr. Smith',
      contact_phone: '+91-9876543210',
      required_by: '2024-01-25T10:00:00Z',
      created_at: '2024-01-20T10:30:00Z',
      updated_at: '2024-01-20T10:30:00Z',
      match_count: 0
    },
    {
      id: 2,
      hospital_name: 'Metro Medical Center',
      hospital_city: 'Thiruvananthapuram',
      hospital_district: 'Thiruvananthapuram',
      patient_name: 'Michael Brown',
      blood_group: 'A+',
      units_required: 1,
      urgency: 'medium',
      status: 'in_progress',
      description: 'Regular blood transfusion needed',
      contact_person: 'Dr. Davis',
      contact_phone: '+91-9876543211',
      required_by: '2024-01-28T14:00:00Z',
      created_at: '2024-01-19T14:20:00Z',
      updated_at: '2024-01-21T09:15:00Z',
      match_count: 2
    },
    {
      id: 3,
      hospital_name: 'Regional Hospital',
      hospital_city: 'Kozhikode',
      hospital_district: 'Kozhikode',
      patient_name: 'Lisa Anderson',
      blood_group: 'B+',
      units_required: 3,
      urgency: 'low',
      status: 'completed',
      description: 'Scheduled surgery preparation',
      contact_person: 'Dr. Wilson',
      contact_phone: '+91-9876543212',
      required_by: '2024-01-30T08:00:00Z',
      created_at: '2024-01-18T09:15:00Z',
      updated_at: '2024-01-22T16:45:00Z',
      match_count: 3
    },
    {
      id: 4,
      hospital_name: 'City General Hospital',
      hospital_city: 'Kochi',
      hospital_district: 'Ernakulam',
      patient_name: 'David Lee',
      blood_group: 'AB+',
      units_required: 1,
      urgency: 'high',
      status: 'cancelled',
      description: 'Patient condition improved, no longer needed',
      contact_person: 'Dr. Garcia',
      contact_phone: '+91-9876543213',
      required_by: '2024-01-23T12:00:00Z',
      created_at: '2024-01-17T13:45:00Z',
      updated_at: '2024-01-19T11:20:00Z',
      match_count: 1
    }
  ];

  const mockDonors = [
    { id: 1, name: 'John Smith', blood_group: 'O+', city: 'Kochi', is_available: true },
    { id: 2, name: 'Emily Davis', blood_group: 'A+', city: 'Thiruvananthapuram', is_available: true },
    { id: 3, name: 'Robert Wilson', blood_group: 'B+', city: 'Kozhikode', is_available: true },
    { id: 4, name: 'Maria Garcia', blood_group: 'AB+', city: 'Kochi', is_available: false }
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = ['low', 'medium', 'high'];
  const statusOptions = ['pending', 'in_progress', 'completed', 'cancelled', 'closed'];

  useEffect(() => {
    fetchRequests();
  }, [pagination.page, searchTerm, filters]);

  const fetchRequests = async () => {
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
      let filteredRequests = [...mockRequests];
      
      if (searchTerm) {
        filteredRequests = filteredRequests.filter(request =>
          request.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.hospital_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (filters.blood_group) {
        filteredRequests = filteredRequests.filter(request => request.blood_group === filters.blood_group);
      }
      
      if (filters.urgency) {
        filteredRequests = filteredRequests.filter(request => request.urgency === filters.urgency);
      }
      
      if (filters.status) {
        filteredRequests = filteredRequests.filter(request => request.status === filters.status);
      }
      
      setRequests(filteredRequests);
      setPagination(prev => ({
        ...prev,
        total: filteredRequests.length,
        pages: Math.ceil(filteredRequests.length / prev.per_page)
      }));
    } catch (err) {
      setError('Failed to fetch requests');
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
    setFilters({ blood_group: '', hospital_id: '', urgency: '', status: '' });
    setSearchTerm('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleAssignDonor = (request) => {
    setSelectedRequest(request);
    // Filter available donors with compatible blood group
    const compatibleDonors = mockDonors.filter(donor => 
      donor.is_available && isCompatibleBloodGroup(donor.blood_group, request.blood_group)
    );
    setAvailableDonors(compatibleDonors);
    setSelectedDonor('');
    setShowAssignModal(true);
  };

  const handleStatusChange = (request, status) => {
    setSelectedRequest(request);
    setNewStatus(status);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
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
      
      setRequests(prev => prev.map(request => 
        request.id === selectedRequest.id 
          ? { ...request, status: newStatus, updated_at: new Date().toISOString() }
          : request
      ));
      
      setShowStatusModal(false);
      setSelectedRequest(null);
      setNewStatus('');
    } catch (err) {
      setError('Failed to update request status');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmAssignDonor = async () => {
    if (!selectedDonor) return;
    
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
      
      setRequests(prev => prev.map(request => 
        request.id === selectedRequest.id 
          ? { ...request, match_count: request.match_count + 1, updated_at: new Date().toISOString() }
          : request
      ));
      
      setShowAssignModal(false);
      setSelectedRequest(null);
      setSelectedDonor('');
    } catch (err) {
      setError('Failed to assign donor');
    } finally {
      setActionLoading(false);
    }
  };

  const isCompatibleBloodGroup = (donorGroup, requiredGroup) => {
    const compatibility = {
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'O-': ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      'A+': ['A+', 'AB+'],
      'A-': ['A+', 'A-', 'AB+', 'AB-'],
      'B+': ['B+', 'AB+'],
      'B-': ['B+', 'B-', 'AB+', 'AB-'],
      'AB+': ['AB+'],
      'AB-': ['AB+', 'AB-']
    };
    
    return requiredGroup in compatibility.get(donorGroup, []);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'orange', icon: Clock, label: 'Pending' },
      in_progress: { color: 'blue', icon: Target, label: 'In Progress' },
      completed: { color: 'green', icon: CheckCircle, label: 'Completed' },
      cancelled: { color: 'red', icon: XCircle, label: 'Cancelled' },
      closed: { color: 'gray', icon: X, label: 'Closed' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`status-badge ${config.color}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const getUrgencyBadge = (urgency) => {
    const urgencyConfig = {
      low: { color: 'green', label: 'Low' },
      medium: { color: 'orange', label: 'Medium' },
      high: { color: 'red', label: 'High' }
    };
    
    const config = urgencyConfig[urgency] || urgencyConfig.medium;
    
    return (
      <span className={`urgency-badge ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && requests.length === 0) {
    return (
      <div className="donation-requests-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading donation requests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="donation-requests">
      {/* Header */}
      <div className="requests-header">
        <div className="header-content">
          <div className="header-title">
            <ClipboardList size={28} />
            <h1>Donation Requests</h1>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">
              <Download size={16} />
              Export
            </button>
            <button className="btn-primary" onClick={fetchRequests}>
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="requests-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <ClipboardList size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{pagination.total}</div>
            <div className="stat-label">Total Requests</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {requests.filter(r => r.status === 'pending').length}
            </div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon in-progress">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {requests.filter(r => r.status === 'in_progress').length}
            </div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {requests.filter(r => r.status === 'completed').length}
            </div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="requests-controls">
        <div className="search-section">
          <div className="search-input">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by patient, hospital, or contact person..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filters-section">
          <div className="filter-group">
            <label>Blood Group</label>
            <select
              value={filters.blood_group}
              onChange={(e) => handleFilterChange('blood_group', e.target.value)}
            >
              <option value="">All Blood Groups</option>
              {bloodGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Urgency</label>
            <select
              value={filters.urgency}
              onChange={(e) => handleFilterChange('urgency', e.target.value)}
            >
              <option value="">All Urgency</option>
              {urgencyLevels.map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <button className="clear-filters" onClick={clearFilters}>
            <RefreshCw size={16} />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="requests-table-container">
        <div className="table-header">
          <div className="table-title">
            <span>Donation Requests</span>
            <span className="table-count">({pagination.total} requests)</span>
          </div>
        </div>
        
        <div className="table-wrapper">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Hospital</th>
                <th>Patient</th>
                <th>Blood Group</th>
                <th>Units</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Matches</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <div className="hospital-info">
                      <div className="hospital-avatar">
                        <Building2 size={20} />
                      </div>
                      <div className="hospital-details">
                        <div className="hospital-name">{request.hospital_name}</div>
                        <div className="hospital-location">
                          <MapPin size={12} />
                          {request.hospital_city}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="patient-info">
                      <div className="patient-name">{request.patient_name}</div>
                      <div className="contact-person">
                        <Phone size={12} />
                        {request.contact_person}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="blood-group">
                      <Droplets size={16} />
                      {request.blood_group}
                    </div>
                  </td>
                  <td>
                    <div className="units-required">
                      <span className="units-number">{request.units_required}</span>
                      <span className="units-label">units</span>
                    </div>
                  </td>
                  <td>{getUrgencyBadge(request.urgency)}</td>
                  <td>{getStatusBadge(request.status)}</td>
                  <td>
                    <div className="match-count">
                      <Users size={14} />
                      {request.match_count}
                    </div>
                  </td>
                  <td>
                    <div className="created-date">
                      <Calendar size={14} />
                      {formatDate(request.created_at)}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn view"
                        onClick={() => handleViewDetails(request)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {request.status === 'pending' && (
                        <button 
                          className="action-btn assign"
                          onClick={() => handleAssignDonor(request)}
                          title="Assign Donor"
                        >
                          <UserPlus size={16} />
                        </button>
                      )}
                      {(request.status === 'pending' || request.status === 'in_progress') && (
                        <button 
                          className="action-btn cancel"
                          onClick={() => handleStatusChange(request, 'cancelled')}
                          title="Cancel Request"
                        >
                          <X size={16} />
                        </button>
                      )}
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

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h3>Request Details</h3>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-section">
                  <h4>Hospital Information</h4>
                  <div className="detail-item">
                    <strong>Name:</strong> {selectedRequest?.hospital_name}
                  </div>
                  <div className="detail-item">
                    <strong>City:</strong> {selectedRequest?.hospital_city}
                  </div>
                  <div className="detail-item">
                    <strong>District:</strong> {selectedRequest?.hospital_district}
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Patient Information</h4>
                  <div className="detail-item">
                    <strong>Name:</strong> {selectedRequest?.patient_name}
                  </div>
                  <div className="detail-item">
                    <strong>Blood Group:</strong> {selectedRequest?.blood_group}
                  </div>
                  <div className="detail-item">
                    <strong>Units Required:</strong> {selectedRequest?.units_required}
                  </div>
                  <div className="detail-item">
                    <strong>Urgency:</strong> {getUrgencyBadge(selectedRequest?.urgency)}
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Contact Information</h4>
                  <div className="detail-item">
                    <strong>Contact Person:</strong> {selectedRequest?.contact_person}
                  </div>
                  <div className="detail-item">
                    <strong>Phone:</strong> {selectedRequest?.contact_phone}
                  </div>
                  <div className="detail-item">
                    <strong>Required By:</strong> {formatDate(selectedRequest?.required_by)}
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Request Information</h4>
                  <div className="detail-item">
                    <strong>Status:</strong> {getStatusBadge(selectedRequest?.status)}
                  </div>
                  <div className="detail-item">
                    <strong>Created At:</strong> {formatDate(selectedRequest?.created_at)}
                  </div>
                  <div className="detail-item">
                    <strong>Updated At:</strong> {formatDate(selectedRequest?.updated_at)}
                  </div>
                  <div className="detail-item">
                    <strong>Matches:</strong> {selectedRequest?.match_count}
                  </div>
                </div>
                
                {selectedRequest?.description && (
                  <div className="detail-section full-width">
                    <h4>Description</h4>
                    <div className="detail-item">
                      {selectedRequest?.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Donor Modal */}
      {showAssignModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Assign Donor</h3>
            </div>
            <div className="modal-body">
              <div className="assign-info">
                <p><strong>Patient:</strong> {selectedRequest?.patient_name}</p>
                <p><strong>Blood Group:</strong> {selectedRequest?.blood_group}</p>
                <p><strong>Hospital:</strong> {selectedRequest?.hospital_name}</p>
              </div>
              
              <div className="form-group">
                <label>Select Compatible Donor</label>
                <select
                  value={selectedDonor}
                  onChange={(e) => setSelectedDonor(e.target.value)}
                >
                  <option value="">Choose a donor...</option>
                  {availableDonors.map(donor => (
                    <option key={donor.id} value={donor.id}>
                      {donor.name} ({donor.blood_group}) - {donor.city}
                    </option>
                  ))}
                </select>
              </div>
              
              {availableDonors.length === 0 && (
                <div className="no-donors">
                  <AlertCircle size={20} />
                  <p>No compatible donors available at the moment.</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowAssignModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={confirmAssignDonor}
                disabled={actionLoading || !selectedDonor}
              >
                {actionLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Assigning...
                  </>
                ) : (
                  'Assign Donor'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Update Request Status</h3>
            </div>
            <div className="modal-body">
              <div className="status-change-info">
                <p><strong>Patient:</strong> {selectedRequest?.patient_name}</p>
                <p><strong>Hospital:</strong> {selectedRequest?.hospital_name}</p>
                <p><strong>New Status:</strong> {newStatus.charAt(0).toUpperCase() + newStatus.slice(1).replace('_', ' ')}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowStatusModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                className="btn-danger"
                onClick={confirmStatusChange}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DonationRequests = () => {
  return (
    <ThemeProvider>
      <DashboardLayout>
        <DonationRequestsContent />
      </DashboardLayout>
    </ThemeProvider>
  );
};

export default DonationRequests;
