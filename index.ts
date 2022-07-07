import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';

// Create a GCP resource (Storage Bucket)
const bucket = new gcp.storage.Bucket('my-bucket', {
    location: 'EU'
});

// Export the DNS name of the bucket
export const bucketName = bucket.url;

// Create a Network
const network = new gcp.compute.Network('test-vpc-network',{ mtu: 1500 });

export const networkIpV4 = network.gatewayIpv4;

const defaultAccount = new gcp.serviceaccount.Account('defaultAccount', {
    accountId: 'service-account-id',
    displayName: 'Service Account',
});
const defaultInstance = new gcp.compute.Instance('test-pulumi', {
    machineType: 'f1-micro',
    tags: [
        'foo',
        'bar',
    ],
    bootDisk: {
        initializeParams: {
            image: 'debian-cloud/debian-11',
        },
    },
    networkInterfaces: [{
        network: network.selfLink,
    }],
    metadata: {
        foo: 'bar',
    },
    desiredStatus: 'TERMINATED',
    metadataStartupScript: 'echo hi > /test.txt',
    serviceAccount: {
        email: defaultAccount.email,
        scopes: ['cloud-platform'],
    },
});

export const instance = defaultInstance.id;
