import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { contactService } from "@/services/api/contactService";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const ContactForm = ({ contact, onSave, onCancel, isEdit = false }) => {
const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    phone_c: "",
    company_c: "",
    position_c: "",
    photo_c: "",
    tags_c: [],
    notes_c: "",
  });
  
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
if (contact) {
      setFormData({
        first_name_c: contact.first_name_c || "",
        last_name_c: contact.last_name_c || "",
        email_c: contact.email_c || "",
        phone_c: contact.phone_c || "",
        company_c: contact.company_c || "",
        position_c: contact.position_c || "",
        photo_c: contact.photo_c || "",
        tags_c: contact.tags_c ? (typeof contact.tags_c === "string" ? contact.tags_c.split(",") : contact.tags_c) : [],
        notes_c: contact.notes_c || "",
      });
    }
  }, [contact]);

  const validateForm = () => {
    const newErrors = {};
    
if (!formData.first_name_c.trim()) {
      newErrors.first_name_c = "First name is required";
    }

    if (!formData.last_name_c.trim()) {
      newErrors.last_name_c = "Last name is required";
    }

    if (!formData.email_c.trim()) {
      newErrors.email_c = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = "Please enter a valid email";
    }

    if (!formData.phone_c.trim()) {
      newErrors.phone_c = "Phone number is required";
    }

    if (!formData.company_c.trim()) {
      newErrors.company_c = "Company is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);
    
    try {
      let savedContact;
      if (isEdit && contact) {
savedContact = await contactService.update(contact.Id, formData);
        toast.success("Contact updated successfully!");
      } else {
        const processedData = {
          ...formData,
          tags_c: Array.isArray(formData.tags_c) ? formData.tags_c : [],
        };
        savedContact = await contactService.create(processedData);
        toast.success("Contact created successfully!");
      }
      
      onSave(savedContact);
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error("Failed to save contact. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
<div className="max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="First Name"
            required
            error={errors.firstName}
value={formData.first_name_c}
            onChange={(e) => handleInputChange("first_name_c", e.target.value)}
            placeholder="Enter first name"
          />
          
          <FormField
label="Last Name"
            required
            error={errors.last_name_c}
            value={formData.last_name_c}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder="Enter last name"
          />
        </div>
        
        <FormField
          label="Email Address"
          required
          type="email"
          error={errors.email}
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Enter email address"
        />
        
        <FormField
          label="Phone Number"
          required
          type="tel"
          error={errors.phone}
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          placeholder="Enter phone number"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Company Name"
            required
            error={errors.company}
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            placeholder="Enter company name"
          />
          
          <FormField
            label="Job Title / Position"
            value={formData.position}
            onChange={(e) => handleInputChange("position", e.target.value)}
            placeholder="Enter job title"
          />
        </div>
        
        <FormField
          label="Profile Photo URL"
          value={formData.photo}
          onChange={(e) => handleInputChange("photo", e.target.value)}
          placeholder="Enter photo URL (optional)"
        />
        
        <FormField label="Contact Tags">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                placeholder="Add a tag (e.g., client, prospect, lead)"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                className="px-4 border-green-200 hover:bg-green-50"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 text-sm font-medium rounded-full border border-primary-300"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-primary-900 transition-colors duration-150"
                    >
                      <ApperIcon name="X" className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FormField>
        
        <FormField label="Additional Notes">
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Add any additional notes or comments about this contact..."
            rows="4"
            className="flex w-full rounded-lg border border-green-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-vertical"
          />
        </FormField>
        
<div className="flex justify-end gap-3 pt-4 border-t border-green-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="border-green-200 hover:bg-green-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            icon={loading ? "Loader2" : "Save"}
            className={loading ? "opacity-75" : "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"}
          >
            {loading ? "Saving..." : isEdit ? "Update Contact" : "Create Contact"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;