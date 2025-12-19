import React from 'react';
import {
  DataSchemaTypes,
  EmailData,
  GeoData,
  SmsData,
  TextData,
  VCardData,
  WifiData,
} from './utils';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { InputWrapper } from '@/components/input-wrapper';

type SchemaComponentProps<T> = {
  value: T | undefined;
};
export const DATA_SCHEMA_COMPONENTS: {
  [K in DataSchemaTypes]: React.FC<SchemaComponentProps<unknown>>;
} = {
  [DataSchemaTypes.Text]: ({ value }) => {
    const data = value as TextData;
    return (
      <InputWrapper label="Text Content" id="qr-text">
        <Textarea
          id="qr-text"
          name="text"
          defaultValue={data.text}
          placeholder="Enter message..."
          required
          minLength={1}
        />
      </InputWrapper>
    );
  },

  [DataSchemaTypes.URL]: ({ value }) => {
    const data = value as TextData;
    return (
      <InputWrapper label="Website URL" id="qr-url">
        <Input
          id="qr-url"
          name="text"
          type="url"
          defaultValue={data.text}
          placeholder="https://example.com"
          required
          pattern="https?://.*"
        />
      </InputWrapper>
    );
  },

  [DataSchemaTypes.Wifi]: ({ value }) => {
    const data = (value as WifiData) || {};
    return (
      <div className="grid gap-4">
        <InputWrapper label="Network Name (SSID)" id="wifi-ssid">
          <Input id="wifi-ssid" name="ssid" defaultValue={data.ssid} required minLength={1} />
        </InputWrapper>
        <InputWrapper label="Password" id="wifi-pass">
          <Input id="wifi-pass" name="password" type="password" defaultValue={data.password} />
        </InputWrapper>
        <InputWrapper label="Encryption Type" id="wifi-enc">
          <select
            id="wifi-enc"
            name="encryption"
            defaultValue={data.encryption || 'WPA'}
            className="border-input data-placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] w-full"
          >
            <option value="WPA">WPA/WPA2 (Standard)</option>
            <option value="WEP">WEP (Legacy)</option>
            <option value="nopass">None (Open Network)</option>
          </select>
        </InputWrapper>
      </div>
    );
  },

  [DataSchemaTypes.Geo]: ({ value }) => {
    const data = (value as GeoData) || {};
    return (
      <div className="flex gap-2">
        <InputWrapper label="Latitude" id="geo-lat">
          <Input
            id="geo-lat"
            name="lat"
            type="number"
            step="any"
            min="-90"
            max="90"
            defaultValue={data.lat}
            required
          />
        </InputWrapper>
        <InputWrapper label="Longitude" id="geo-lng">
          <Input
            id="geo-lng"
            name="lng"
            type="number"
            step="any"
            min="-180"
            max="180"
            defaultValue={data.lng}
            required
          />
        </InputWrapper>
      </div>
    );
  },

  [DataSchemaTypes.Sms]: ({ value }) => {
    const data = (value as SmsData) || {};
    return (
      <div className="grid gap-4">
        <InputWrapper label="Phone Number" id="sms-phone">
          <Input id="sms-phone" name="phone" type="tel" defaultValue={data.phone} required />
        </InputWrapper>
        <InputWrapper label="Message" id="sms-msg">
          <Textarea id="sms-msg" name="message" defaultValue={data.message} maxLength={160} />
        </InputWrapper>
      </div>
    );
  },

  [DataSchemaTypes.Email]: ({ value }) => {
    const data = (value as EmailData) || {};
    return (
      <div className="grid gap-4">
        <InputWrapper label="Email Address" id="email-to">
          <Input id="email-to" name="to" type="email" defaultValue={data.to} required />
        </InputWrapper>
        <InputWrapper label="Subject" id="email-sub">
          <Input id="email-sub" name="subject" defaultValue={data.subject} />
        </InputWrapper>
        <InputWrapper label="Body" id="email-body">
          <Textarea id="email-body" name="body" defaultValue={data.body} />
        </InputWrapper>
      </div>
    );
  },

  [DataSchemaTypes.vCard]: ({ value }) => {
    const data = (value as VCardData) || {};
    return (
      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <InputWrapper label="First Name" id="vc-first">
            <Input id="vc-first" name="firstName" defaultValue={data.firstName} required />
          </InputWrapper>
          <InputWrapper label="Last Name" id="vc-last">
            <Input id="vc-last" name="lastName" defaultValue={data.lastName} required />
          </InputWrapper>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputWrapper label="Organization" id="vc-org">
            <Input id="vc-org" name="organization" defaultValue={data.organization} />
          </InputWrapper>
          <InputWrapper label="Job Title" id="vc-title">
            <Input id="vc-title" name="title" defaultValue={data.title} />
          </InputWrapper>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputWrapper label="Work Phone" id="vc-tel-work">
            <Input id="vc-tel-work" name="telWork" type="tel" defaultValue={data.telWork} />
          </InputWrapper>
          <InputWrapper label="Mobile Phone" id="vc-tel-cell">
            <Input id="vc-tel-cell" name="telCell" type="tel" defaultValue={data.telCell} />
          </InputWrapper>
        </div>

        <InputWrapper label="Email" id="vc-email">
          <Input id="vc-email" name="email" type="email" defaultValue={data.email} />
        </InputWrapper>

        <InputWrapper label="Website / URL" id="vc-url">
          <Input
            id="vc-url"
            name="url"
            type="url"
            defaultValue={data.url}
            placeholder="https://..."
          />
        </InputWrapper>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3 text-gray-500">Address Details</h4>
          <div className="grid gap-4">
            <InputWrapper label="Street Address" id="vc-street">
              <Input id="vc-street" name="street" defaultValue={data.street} />
            </InputWrapper>
            <div className="grid grid-cols-2 gap-4">
              <InputWrapper label="City" id="vc-city">
                <Input id="vc-city" name="city" defaultValue={data.city} />
              </InputWrapper>
              <InputWrapper label="State / Province" id="vc-state">
                <Input id="vc-state" name="state" defaultValue={data.state} />
              </InputWrapper>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputWrapper label="Postal Code" id="vc-zip">
                <Input id="vc-zip" name="postalCode" defaultValue={data.postalCode} />
              </InputWrapper>
              <InputWrapper label="Country" id="vc-country">
                <Input id="vc-country" name="country" defaultValue={data.country} />
              </InputWrapper>
            </div>
          </div>
        </div>

        <InputWrapper label="Notes" id="vc-note">
          <Textarea
            id="vc-note"
            name="note"
            defaultValue={data.note}
            placeholder="Add any extra info..."
          />
        </InputWrapper>
      </div>
    );
  },
};
