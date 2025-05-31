# backend/response_module.py
import subprocess
import logging

logging.basicConfig(level=logging.INFO)

def block_ip(ip_address: str):
    """Block a suspicious IP using iptables."""
    try:
        check_cmd = f"iptables -C INPUT -s {ip_address} -j DROP"
        subprocess.run(check_cmd, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        logging.info(f"IP {ip_address} is already blocked.")
    except subprocess.CalledProcessError:
        add_cmd = f"iptables -A INPUT -s {ip_address} -j DROP"
        subprocess.run(add_cmd, shell=True, check=True)
        logging.info(f"Blocked IP {ip_address} using iptables.")

def unblock_ip(ip_address: str):
    """Unblock a specific IP address."""
    try:
        remove_cmd = f"iptables -D INPUT -s {ip_address} -j DROP"
        subprocess.run(remove_cmd, shell=True, check=True)
        logging.info(f"Unblocked IP {ip_address}.")
    except subprocess.CalledProcessError as e:
        logging.error(f"Error unblocking {ip_address}: {e}")
