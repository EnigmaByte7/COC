# Clash of Code
### Clash of code is a 1v1 live conding contest platform... built on NextJS, Express, Redis, Judge0 , MongoDB, Kafka , nginx and socket.io

# Future Improvements
- this ui is test only, so ui needs generous improvements
- some known issues, state is not preserved for now, so reloading of match page will wipe eveerything
- ~~timer is yet to be added~~
- and much more... in testing right now

👻

# Changelog _Oct 22, 2025 v1.0.1_
- updated architecture
- now have multiple socket io server load balanced by a nginx proxy
- uses the Redis addapter in socket io to handle scalability
- had to ensure session affinity as stated in the socket io docs for using multiple nodes
- much scalable now
- see the new design.. https://app.eraser.io/workspace/GetTMBOb99Sk3KImaK2T?origin=share