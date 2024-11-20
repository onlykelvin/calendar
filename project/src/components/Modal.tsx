import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, Link as LinkIcon, Image, Pencil, Upload } from 'lucide-react';
import { DayData } from '../types';
import { convertToBase64 } from '../utils/imageUtils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  data?: DayData;
  onSave: (date: Date, data: DayData) => void;
  onClear: () => void;
}

export default function Modal({ isOpen, onClose, date, data, onSave, onClear }: ModalProps) {
  const [isEditMode, setIsEditMode] = useState(!data);
  const [note, setNote] = useState('');
  const [links, setLinks] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  const [newPhoto, setNewPhoto] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data) {
      setNote(data.note || '');
      setLinks(data.links || []);
      setPhotos(data.photos || []);
    } else {
      setNote('');
      setLinks([]);
      setPhotos([]);
    }
  }, [data]);

  const handleSave = () => {
    onSave(date, {
      note,
      links,
      photos,
    });
    setIsEditMode(false);
  };

  const addLink = () => {
    try {
      new URL(newLink);
      setLinks([...links, newLink]);
      setNewLink('');
      setError('');
    } catch {
      setError('Please enter a valid URL');
    }
  };

  const addPhoto = () => {
    try {
      new URL(newPhoto);
      setPhotos([...photos, newPhoto]);
      setNewPhoto('');
      setError('');
    } catch {
      setError('Please enter a valid image URL');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      try {
        const base64 = await convertToBase64(file);
        setPhotos([...photos, base64]);
        setError('');
      } catch (err) {
        setError('Failed to upload image');
      }
    }
  };

  const handleClose = () => {
    setIsEditMode(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h2>
            <div className="flex items-center gap-2">
              {!isEditMode && data && (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-400"
                  title="Edit"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {isEditMode ? (
            // Edit Mode
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={4}
                  placeholder="Add your notes here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Links
                </label>
                <div className="space-y-2">
                  {links.map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-blue-500" />
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline truncate flex-1"
                      >
                        {link}
                      </a>
                      <button
                        onClick={() => setLinks(links.filter((_, i) => i !== index))}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                      placeholder="Enter URL"
                      className="flex-1 p-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={addLink}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Photos
                </label>
                <div className="space-y-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
                        {photo.startsWith('data:') ? 'Uploaded image' : photo}
                      </span>
                      <button
                        onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newPhoto}
                      onChange={(e) => setNewPhoto(e.target.value)}
                      placeholder="Enter image URL"
                      className="flex-1 p-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={addPhoto}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Upload className="w-5 h-5" />
                      Upload Image
                    </button>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Max size: 5MB
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                <button
                  onClick={onClear}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  Clear Day
                </button>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      if (data) {
                        setIsEditMode(false);
                        setNote(data.note || '');
                        setLinks(data.links || []);
                        setPhotos(data.photos || []);
                      } else {
                        handleClose();
                      }
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="space-y-6">
              {note && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</h3>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{note}</p>
                </div>
              )}

              {links.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Links</h3>
                  <div className="space-y-2">
                    {links.map((link, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-blue-500" />
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {link}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {photos.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Photos</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {photos.map((photo, index) => (
                      <a
                        key={index}
                        href={photo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {!note && !links.length && !photos.length && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No content added yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}